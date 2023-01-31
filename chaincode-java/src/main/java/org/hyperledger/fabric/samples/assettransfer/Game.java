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
    private String player1;

    @Property()
    private String player2;

    @Property()
    private int player1Move;

    @Property()
    private int player2Move;

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

    public int getPlayer1Move() {
        return player1Move;
    }

    public int getPlayer2Move() {
        return player2Move;
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

    public void setPlayer1(final String newPlayer) {
        this.player1 = newPlayer;
    }

    public void setPlayer2(final String newPlayer) {
        this.player2 = newPlayer;
    }

    public void setPlayer1Move(final int newMove) {
        this.player1Move = newMove;
    }

    public void setPlayer2Move(final int newMove) {
        this.player2Move = newMove;
    }

    public Game(@JsonProperty("gameID") final String gameID, @JsonProperty("status") final String status) {
        this.gameID = gameID;
        this.status = status;
    }

    public Game(@JsonProperty("gameID") final String gameID,
    @JsonProperty("player1") final String player1,
    @JsonProperty("player2") final String player2,
    @JsonProperty("player1Move") final int player1Move,
    @JsonProperty("player2Move") final int player2Move,
    @JsonProperty("status") final String status,
    @JsonProperty("winner") final String winner) {
        this.gameID = gameID;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Move = player1Move;
        this.player2Move = player2Move;
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
                new String[] {getGameID(), getPlayer1(), getPlayer2(), getStatus(), getWinner()},
                new String[] {other.getGameID(), other.getPlayer1(), other.getPlayer2(), other.getStatus(), other.getWinner()})
                &&
                Objects.deepEquals(
                new int[] {getPlayer1Move(), getPlayer2Move()},
                new int[] {other.getPlayer1Move(), other.getPlayer2Move()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getGameID(), getPlayer1(), getPlayer2(), getStatus(), getWinner());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() +  "\nGAMEID: " + gameID
        + "\nPlayer1: " + player1
        + "\nPlayer1 Move: " + this.player1Move
        + "\nPlayer2: " + player2
        + "\nPlayer2 Move: " + this.player2Move
        + "\nStatus: " + status
        + "\nWinner: " + winner + "\n";
    }
}
