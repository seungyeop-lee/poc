package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

public class RsaKeyPair {
    private final RsaPrivateKey privateKey;
    private final RsaPublicKey publicKey;

    public RsaKeyPair(RsaPrivateKey privateKey, RsaPublicKey publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    public RsaPrivateKey getPrivateKey() {
        return privateKey;
    }

    public RsaPublicKey getPublicKey() {
        return publicKey;
    }
}
