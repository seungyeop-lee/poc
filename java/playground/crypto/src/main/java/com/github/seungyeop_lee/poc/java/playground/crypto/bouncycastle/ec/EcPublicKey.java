package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;

public class EcPublicKey implements CipherKey {
    private final ECPublicKeyParameters key;

    public EcPublicKey(ECPublicKeyParameters key) {
        this.key = key;
    }

    @Override
    public byte[] serialize() {
        return key.getQ().getEncoded(false);
    }

    @Override
    public ECPublicKeyParameters unwrap() {
        return key;
    }
}
