package org.hyperledger.fabric.samples.assettransfer;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;


@DataType()
public final class Game {

    @Property()
    private final String gameID;

    @Property()
    private String org1Move;

    @Property()
    private String org2Move;

    @Property()
    private String status;

    @Property()
    private String winner;

    public String getGameID() {
        return gameID;
    }

    public String getOrg1Move() {
        return org1Move;
    }

    public String getOrg2Move() {
        return org2Move;
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

    public void setOrg1Move(final String newMove) {
        this.org1Move = newMove;
    }

    public void setOrg2Move(final String newMove) {
        this.org2Move = newMove;
    }

    public Game(@JsonProperty("gameID") final String gameID, @JsonProperty("status") final String status) {
        this.gameID = gameID;
        this.status = status;
    }

    public Game(@JsonProperty("gameID") final String gameID,
    @JsonProperty("org1Move") final String player1Move,
    @JsonProperty("org2Move") final String player2Move,
    @JsonProperty("status") final String status,
    @JsonProperty("winner") final String winner) {
        this.gameID = gameID;
        this.org1Move = player1Move;
        this.org2Move = player2Move;
        this.status = status;
        this.winner = winner;
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
                new String[] {getGameID(), getStatus(), getWinner(), getOrg1Move(), getOrg2Move()},
                new String[] {other.getGameID(), other.getStatus(), other.getWinner(), other.getOrg1Move(), other.getOrg2Move()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getGameID(),  getStatus(), getWinner());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() +  "\nGAMEID: " + gameID
        + "\nOrg1 Move: " + this.org1Move
        + "\nOrg2 Move: " + this.org2Move
        + "\nStatus: " + status
        + "\nWinner: " + winner + "\n";
    }
}
