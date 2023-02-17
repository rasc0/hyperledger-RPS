package org.hyperledger.fabric.samples.assettransfer;

public class IncorrectMoveException extends Exception {
    public IncorrectMoveException(final String errorMessage) {
        super(errorMessage);
    }
}
