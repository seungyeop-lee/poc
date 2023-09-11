package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface Signer {
    byte[] sign(byte[] data, CipherKey privateKey);
    boolean verify(byte[] data, byte[] signature, CipherKey publicKey);
}
