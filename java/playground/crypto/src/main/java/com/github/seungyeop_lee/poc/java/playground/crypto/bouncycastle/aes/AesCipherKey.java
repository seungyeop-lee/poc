package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import org.bouncycastle.crypto.params.KeyParameter;

public class AesCipherKey {
    private final KeyParameter key;

    public AesCipherKey(KeyParameter key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getKey();
    }

    public KeyParameter unwrap() {
        return key;
    }
}
