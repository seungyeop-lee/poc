package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;

public class EcPrivateKey implements CipherKey {
    private final ECPrivateKeyParameters key;

    public EcPrivateKey(ECPrivateKeyParameters key) {
        this.key = key;
    }

    @Override
    public byte[] serialize() {
        return key.getD().toByteArray();
    }

    @Override
    public ECPrivateKeyParameters unwrap() {
        return key;
    }
}
