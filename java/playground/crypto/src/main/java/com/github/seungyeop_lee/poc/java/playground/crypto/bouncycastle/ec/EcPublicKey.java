package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import org.bouncycastle.crypto.params.ECPublicKeyParameters;

public class EcPublicKey {
    private final ECPublicKeyParameters key;

    public EcPublicKey(ECPublicKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getQ().getEncoded(false);
    }

    public ECPublicKeyParameters unwrap() {
        return key;
    }
}
