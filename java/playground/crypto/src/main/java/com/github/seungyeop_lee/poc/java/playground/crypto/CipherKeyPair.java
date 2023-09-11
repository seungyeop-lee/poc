package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface CipherKeyPair {
    CipherKey getPrivateKey();
    CipherKey getPublicKey();
}
