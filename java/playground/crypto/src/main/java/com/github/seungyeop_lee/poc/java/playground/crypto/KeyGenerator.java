package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface KeyGenerator {
    CipherKey generateKey();
    CipherKey generateKeyFrom(byte[] serializedKey);
}
