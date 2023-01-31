package org.hyperledger.fabric.samples.assettransfer;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

public final class GameTest {

    @Nested
    class Equality {

        @Test
        public void isReflexive() {
            Game game = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");

            assertThat(game).isEqualTo(game);
        }

        @Test
        public void isSymmetric() {
            Game gameA = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");
            Game gameB = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");

            assertThat(gameA).isEqualTo(gameB);
            assertThat(gameB).isEqualTo(gameA);
        }

        @Test
        public void isTransitive() {
            Game gameA = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");
            Game gameB = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");
            Game gameC = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");


            assertThat(gameA).isEqualTo(gameB);
            assertThat(gameB).isEqualTo(gameC);
            assertThat(gameA).isEqualTo(gameC);
        }

        @Test
        public void handlesInequality() {
            Game gameA = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");
            Game gameB = new Game("Game2", "player1", "player2", "rock", "paper", "OPEN", "player2");

            assertThat(assetA).isNotEqualTo(assetB);
        }

        @Test
        public void handlesOtherObjects() {
            Game gameA = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");
            String assetB = "not a game";

            assertThat(gameA).isNotEqualTo(assetB);
        }

        @Test
        public void handlesNull() {
            Game game = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");

            assertThat(game).isNotEqualTo(null);
        }
    }

    @Test
    public void toStringIdentifiesAsset() {
        Game game = new Game("Game1", "player1", "player2", "rock", "paper", "OPEN", "player2");

        assertThat(asset.toString()).isEqualTo("Game@e04f6c53 [GAMEID=asset1, color=Blue, size=20, owner=Guy, appraisedValue=100]");
    }
}