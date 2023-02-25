package org.hyperledger.fabric.samples.assettransfer;

import java.util.HashMap;
import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;


@DataType()
public final class Game {

    @Property()
    private final String gameID;

    @JsonProperty("moves")
    private HashMap<String, String> moves;

    @Property()
    private String status;

    @Property()
    private String winner;

    public String getGameID() {
        return gameID;
    }

    public HashMap<String, String> getMoves() {
        return this.moves;
    }

    public String getMove(final String org) {
        return moves.get(org);
    }

    public String getStatus() {
        return status;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(final String newWinner) {
        this.winner = newWinner;
    }

    public void setStatus(final String newStatus) {
        this.status = newStatus;
    }

    public void setMove(final String org, final String newMove) {
        moves.put(org, newMove);
    }

    public Game(@JsonProperty("gameID") final String gameID, @JsonProperty("status") final String status) {
        moves = new HashMap<String, String>();

        this.gameID = gameID;
        this.status = status;
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
                new String[] {getGameID(), getStatus(), getWinner()},
                new String[] {other.getGameID(), other.getStatus(), other.getWinner()})

                &&

                Objects.deepEquals(getMoves(), other.getMoves());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getGameID(),  getStatus(), getWinner(), getMoves());
    }

    @Override
    public String toString() {
        String returnString = "\nGAMEID: " + gameID;

        for (String org : moves.keySet()) {
            returnString += "\n" + org + " : " + moves.get(org);
        }

        return returnString
        + "\nStatus: " + status
        + "\nWinner: " + winner + "\n";
    }
}
