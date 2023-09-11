package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

public class EcKeyPair {
    private final EcPrivateKey privateKey;
    private final EcPublicKey publicKey;

    public EcKeyPair(EcPrivateKey privateKey, EcPublicKey publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    public EcPrivateKey getPrivateKey() {
        return privateKey;
    }

    public EcPublicKey getPublicKey() {
        return publicKey;
    }
}
