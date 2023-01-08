package org.hyperledger.fabric.samples.assettransfer;

import java.util.ArrayList;
import java.util.List;

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
import org.hyperledger.fabric.contract.annotation.License;

@Contract(
        name = "rps",
        info = @Info(
                title = "Rock Paper Scissors",
                description = "The hyperlegendary rps",
                version = "0.0.1-SNAPSHOT",
                license = @License(
                        name = "Apache 2.0 License",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html")
                ))
@Default
public final class GameTransfer implements ContractInterface {

    private final Genson genson = new Genson();

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void CreateGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        Game game = new Game(gameID);

       // byte[] gameJson = game.serialize();
        byte[] gameJson = genson.serializeBytes(game);

        stub.putState(gameID, gameJson); // Add to the global state
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String queryAllGame(final Context ctx) {
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

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void PlayGame(final Context ctx, final String gameID) {
        ChaincodeStub stub = ctx.getStub();

        Game game = getState(ctx, gameID);

        String p1 = game.getPlayer1Move();
        String p2 = game.getPlayer2Move();

        // security consideration - not checking the user's input and depending on how (order) that game is evaluated could lead to default win
        if ((p1 == "rock" && p2 == "scissors") || (p1 == "scissors" && p2 == "paper") || (p1 == "paper" && p2 == "rock")) {
            game.setWinner(game.getPlayer1());
        } else if (p1 == p2) {
            game.setWinner("TIE");
        } else {
            game.setWinner(game.getPlayer2());
        }

        //byte[] gameJson = game.serialize();
        byte[] gameJson = genson.serializeBytes(game);

        stub.putState(gameID, gameJson);
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void SubmitMove(final Context ctx, final String gameID, final String user, final String move) {
        ChaincodeStub stub = ctx.getStub();

        Game game = getState(ctx, gameID);

        game.setMove(user, move);

        byte[] gameJson = genson.serializeBytes(game);
        //byte[] gameJson = game.serialize();

        stub.putState(gameID, gameJson);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String QueryGame(final Context ctx, final String gameID) {
        Game game = getState(ctx, gameID);

        return game.toString();
    }

    private Game getState(final Context ctx, final String gameID) {
        byte[] assetJSON = ctx.getStub().getState(gameID);
        if (assetJSON == null || assetJSON.length == 0) {
            String errorMessage = String.format("Asset %s does not exist", gameID);
            System.err.println(errorMessage);
            throw new ChaincodeException(errorMessage);
        }

        try {
            Game game = Game.deserialize(assetJSON);
            return game;
        } catch (Exception e) {
            throw new ChaincodeException("Deserialize error: " + e.getMessage());
        }
    }
}
