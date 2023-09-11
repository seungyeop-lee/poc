package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface Crypto {
    byte[] encrypt(byte[] plainData, CipherKey key);
    byte[] decrypt(byte[] encryptedData, CipherKey key);
}
