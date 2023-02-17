package org.hyperledger.fabric.samples.assettransfer;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class PrivateMove {

    @Property()
    private final int move;

    @Property()
    private final int salt;

    public int getMove() {
        return move;
    }

    public int getSalt() {
        return salt;
    }

    public PrivateMove(@JsonProperty("move") final int move, @JsonProperty("salt") final int salt) {
        this.move = move;
        this.salt = salt;
    }
}
