package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import org.bouncycastle.crypto.params.ECPrivateKeyParameters;

public class EcPrivateKey {
    private final ECPrivateKeyParameters key;

    public EcPrivateKey(ECPrivateKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getD().toByteArray();
    }

    public ECPrivateKeyParameters unwrap() {
        return key;
    }
}
