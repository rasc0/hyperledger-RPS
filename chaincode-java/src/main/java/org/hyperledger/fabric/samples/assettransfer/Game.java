package org.hyperledger.fabric.samples.assettransfer;

import java.util.Map;
import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

import com.owlike.genson.annotation.JsonProperty;

import static java.nio.charset.StandardCharsets.UTF_8;


@DataType()
public final class Game {

    @Property()
    private final String gameID;

    @Property()
    private String player1;

    @Property()
    private String player2;

    @Property()
    private String player1Move;

    @Property()
    private String player2Move;

    @Property()
    private String status;

    @Property()
    private String winner;

    public String getGameID() {
        return gameID;
    }

    public String getPlayer1() {
        return player1;
    }

    public String getPlayer2() {
        return player2;
    }

    public String getPlayer1Move() {
        return player1Move;
    }

    public String getPlayer2Move() {
        return player2Move;
    }

    public String getStatus() {
        return status;
    }

    public String getWinner() {
        return winner;
    }

    public void setMove(final String player, final String move) {
        if (this.player1 == null) {
            this.player1 = player;
            this.player1Move = move;
        } else if (this.player2 == null) {
            this.player2 = player;
            this.player2Move = move;
        }
    }

    public void setWinner(final String newWinner) {
        this.winner = newWinner;
        this.status = "CLOSED";
    }

    public Game(@JsonProperty("gameID") final String gameID) {
        this.gameID = gameID;
        this.status = "OPEN";
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Game other = (Game) obj;

        return Objects.deepEquals(
                new String[] {getGameID(), getPlayer1(), getPlayer2(), getStatus(), getWinner()},
                new String[] {other.getGameID(), other.getPlayer1(), other.getPlayer2(), other.getStatus(), other.getWinner()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getGameID(), getPlayer1(), getPlayer2(), getStatus(), getWinner());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() +  " GAMEID: " + gameID
        + "\nPlayer1: " + player1 + " move: " + (this.player1Move != null ? this.player1Move : "None")
        + "\nPlayer2: " + player2 + " move: " + (this.player2Move != null ? this.player2Move : "None")
        + "\nStatus: " + status
        + "\nWinner: " + winner + "\n";
    }

    public static Game deserialize(final byte[] gameJSON) {
        return deserialize(new String(gameJSON, UTF_8));
    }

    public static Game deserialize(final String gameJSON) {

        JSONObject json = new JSONObject(gameJSON);
        Map<String, Object> tMap = json.toMap();
        final String id = (String) tMap.get("gameID");

        return new Game(id);
    }

    // public byte[] serialize() {
    //     return serialize(null).getBytes(UTF_8);
    // }

    // public String serialize(final String privateProps) {
    //     Map<String, Object> tMap = new HashMap();
    //     tMap.put("GameID", gameID);
    //     tMap.put("Player1", player1);
    //     tMap.put("Player2", player2);
    //     tMap.put("Player1Move", player1Move);
    //     tMap.put("Player2Move", player2Move);
    //     tMap.put("Status", status);
    //     tMap.put("Winner", winner);
    //     return new JSONObject(tMap).toString();
    // }
}
