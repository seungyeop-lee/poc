package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface KeyPairGenerator {
    CipherKeyPair generateKeyPair();
    CipherKey generatePrivateKeyFrom(byte[] serializedPrivateKey);
    CipherKey generatePublicKeyFrom(byte[] serializedPublicKey);
}
