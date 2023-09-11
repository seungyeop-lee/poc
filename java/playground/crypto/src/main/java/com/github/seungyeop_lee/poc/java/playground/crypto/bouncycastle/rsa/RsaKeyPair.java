package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKeyPair;

public class RsaKeyPair implements CipherKeyPair {
    private final RsaPrivateKey privateKey;
    private final RsaPublicKey publicKey;

    public RsaKeyPair(RsaPrivateKey privateKey, RsaPublicKey publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    @Override
    public RsaPrivateKey getPrivateKey() {
        return privateKey;
    }

    @Override
    public RsaPublicKey getPublicKey() {
        return publicKey;
    }
}
