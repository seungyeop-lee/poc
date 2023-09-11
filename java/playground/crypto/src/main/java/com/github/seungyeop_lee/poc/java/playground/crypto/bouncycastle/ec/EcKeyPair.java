package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKeyPair;

public class EcKeyPair implements CipherKeyPair {
    private final EcPrivateKey privateKey;
    private final EcPublicKey publicKey;

    public EcKeyPair(EcPrivateKey privateKey, EcPublicKey publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    @Override
    public EcPrivateKey getPrivateKey() {
        return privateKey;
    }

    @Override
    public EcPublicKey getPublicKey() {
        return publicKey;
    }
}
