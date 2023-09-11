package com.github.seungyeop_lee.poc.java.playground.crypto;

public interface CipherKey {
    byte[] serialize();
    Object unwrap();
}
