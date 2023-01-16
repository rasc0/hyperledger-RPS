import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.samples.assettransfer.GameTransfer;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public final class GameTest {

    @Nested
    class InvokeQueryGameTransaction {

        @Test
        public void whenTestExists() {
            GameTranser gameTransfer = new GameTransfer();
            Game gameContract = new Game();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);
            when(stub.getStringState("game1"))
                    .thenReturn(new Game("game1").serialize());

            Game game = gameTransfer.getState(ctx, "game1");

            assertThat(game.getGameID())
                    .isEqualTo("game1");
            assertThat(game.getStatus())
                    .isEqualTo("OPEN");
            

            game = gameTransfer.SubmitMove(ctx, "game1", "player1", "rock");

            assertThat(game.getPlayer1())
                    .isEqualTo("player1");
            assertThat(game.getPlayer1Move())
                    .isEqualTo("rock");
            assertThat(game.getPlayer2())
                    .isNull();

            game = gameTransfer.SubmitMove(ctx, "game1", "player2", "paper");

            assertThat(game.getPlayer1())
                    .isEqualTo("player2");
            assertThat(game.getPlayer1Move())
                    .isEqualTo("paper");

            System.out.println("DONE");
        }

    }

}