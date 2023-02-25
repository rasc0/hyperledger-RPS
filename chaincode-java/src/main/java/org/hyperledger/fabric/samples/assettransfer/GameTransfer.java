package org.hyperledger.fabric.samples.assettransfer;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import com.owlike.genson.Genson;

import org.hyperledger.fabric.contract.annotation.Info;

@Contract(
        name = "rps",
        info = @Info(
                title = "Rock Paper Scissors",
                description = "The hyperlegendary rps"))
@Default
public final class GameTransfer implements ContractInterface {

    private final Genson genson = new Genson();
    private final String ORG1 = "Org1MSP";
    private final String ORG2 = "Org2MSP";

    @Transaction
    public void DeleteGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        try {
            stub.delState(gameID);
        } catch (Exception e) {
            System.out.println("Couldn't delete game " + gameID);
            System.out.println(e.getMessage());
        }
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void CreateGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        Game game = new Game(gameID, "OPEN");

        String gameJson = genson.serialize(game);

        stub.putStringState(gameID, gameJson);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String QueryAllGames(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();

        QueryResultsIterator<KeyValue> results = stub.getStateByRange("", "");

        List<Game> gameList = new ArrayList<Game>();

        for (KeyValue result: results) {
            Game game = genson.deserialize(result.getStringValue(), Game.class);
            gameList.add(game);
        }

        final String response = genson.serialize(gameList);

        return response;
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String QueryGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        String gameJSON = stub.getStringState(gameID);
        System.out.println("Serialized JSON: " + gameJSON);

        if (gameJSON == null || gameJSON.isEmpty()) {
            String errorMessage = String.format("Game %s does not exist", gameID);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage);
        }

        Game game = genson.deserialize(gameJSON, Game.class);

        System.out.println("Deserialized game: " + game.toString());

        return game.toString();
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void SubmitMove(final Context ctx, final String gameID, final int move) {
        ChaincodeStub stub = ctx.getStub();

        Game game = getState(ctx, gameID);

        String clientMSPID = ctx.getClientIdentity().getMSPID();
        String peerMSPID = ctx.getStub().getMspId();

        System.out.println("CLIENT MSPID: "  + clientMSPID);
        System.out.println("PEER MSPID: " + peerMSPID);

        String collectionName;

        if (peerMSPID.equals(ORG1)) {
            collectionName = "Org1MSPPrivateCollection";
        } else if (peerMSPID.equals(ORG2)) {
            collectionName = "Org2MSPPrivateCollection";
        } else {
            collectionName = "none";
            System.out.println("NO ORG FOUND");
        }

        // Calculate random salt:
        int salt = ThreadLocalRandom.current().nextInt();

        // Create a hash of the move + salt
        String hash = null;

        try {
            hash = createHash(Integer.toString(move + salt));
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Exception: " + e);
        }

        // Verify that the client is submitting request to peer in their organization
        // This is to ensure that a client from another org doesn't attempt to read or
        // write private data from this peer.
        verifyClientOrgMatchesPeerOrg(ctx);

        // Create JSON to store into private collection (move, salt) with GameID as the key
        PrivateMove privateMove = new PrivateMove(move, salt);

        byte[] privateMoveBytes = genson.serializeBytes(privateMove);

        stub.putPrivateData(collectionName, gameID, privateMoveBytes);

        // Add hash as move to public ledger
        game.setMove(peerMSPID, hash);

        String gameJson = genson.serialize(game);

        System.out.println(gameJson);

        stub.putStringState(gameID, gameJson);
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void RevealMove(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        Game game = getState(ctx, gameID);

        System.out.println("Game fetched: \n" + game);

        byte[] moveBytes;
        PrivateMove privateMove;
        String pubHash; // public ledger hash

        String clientMSPID = ctx.getClientIdentity().getMSPID();
        String peerMSPID = ctx.getStub().getMspId();

        System.out.println("CLIENT MSPID: "  + clientMSPID);
        System.out.println("PEER MSPID: " + peerMSPID);

        verifyClientOrgMatchesPeerOrg(ctx);

        // Get the player's moves and get the hashes (receipts) from public ledger
        if (peerMSPID.equals(ORG1)) {
            moveBytes = stub.getPrivateData("Org1MSPPrivateCollection", gameID);
            privateMove = genson.deserialize(moveBytes, PrivateMove.class);
            pubHash = game.getMove(ORG1);
        } else {
            moveBytes = stub.getPrivateData("Org2MSPPrivateCollection", gameID);
            privateMove = genson.deserialize(moveBytes, PrivateMove.class);
            pubHash = game.getMove(ORG2);
        }

        // Verify that the hash on the public ledger aligns with private move
        try {
            System.out.println("Checking hash for " + peerMSPID + ": " + pubHash);
            checkHash(privateMove, pubHash);
        } catch (IncorrectMoveException e) {
            System.out.println("Exception: " + e);
            game.setStatus("ERROR");
            return;
        }

        // Make the move publicly visible
        game.setMove(peerMSPID, Integer.toString(privateMove.getMove()));

        game.setStatus("CLOSED");

        String gameJson = genson.serialize(game);

        stub.putStringState(gameID, gameJson);
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void PlayGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        Game game = getState(ctx, gameID);

        //  (1 = Rock, 2 = Paper, 3 = Scissors)
        int p1move = Integer.parseInt(game.getMove(ORG1));
        int p2move = Integer.parseInt(game.getMove(ORG2));

        int[][] result = {{0, 2, 1},
                        {1, 0, 2},
                        {2, 1, 0}
                        };

        int outcome = result[p1move - 1][p2move - 1];

        if (outcome == 0) {
            game.setWinner("TIE");
          } else if (outcome == 1) {
            game.setWinner("ORG 1");
          } else {
            game.setWinner("ORG 2");
          }

        game.setStatus("PLAYED");

        String gameJson = genson.serialize(game);

        stub.putStringState(gameID, gameJson);
    }

    private String createHash(final String inputString) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        byte[] hash = messageDigest.digest(inputString.getBytes());

        // convert the byte array to a hexadecimal string
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private Game getState(final Context ctx, final String gameID) {
        byte[] assetJSON = ctx.getStub().getState(gameID);
        if (assetJSON == null || assetJSON.length == 0) {
            String errorMessage = String.format("Game %s does not exist", gameID);
            System.err.println(errorMessage);
            throw new ChaincodeException(errorMessage);
        }

        try {
            Game game = genson.deserialize(assetJSON, Game.class);
            return game;
        } catch (Exception e) {
            throw new ChaincodeException("Deserialize error: " + e.getMessage());
        }
    }

    private boolean checkHash(final PrivateMove pMove, final String hash) throws IncorrectMoveException {

        int move = pMove.getMove();
        int salt = pMove.getSalt();

        boolean result = false;
        try {
            String hashCheck = createHash(Integer.toString(move + salt));

            System.out.println("Calculated hash: " + hashCheck);

            result = hashCheck.equals(hash);
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Exception: " + e);
        }

        if (result) {
            System.out.println("Hashes match");
            return result;
        }

        throw new IncorrectMoveException("The move does not match");
    }

    private void verifyClientOrgMatchesPeerOrg(final Context ctx) {
        String clientMSPID = ctx.getClientIdentity().getMSPID();
        String peerMSPID = ctx.getStub().getMspId();

        if (!peerMSPID.equals(clientMSPID)) {
            String errorMessage = String.format("Client from org %s is not authorized to read or write private data from an org %s peer", clientMSPID, peerMSPID);
            System.err.println(errorMessage);
            throw new ChaincodeException(errorMessage, "INVALID ACCESS");
        }
    }

}
