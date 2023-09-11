package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import org.bouncycastle.crypto.params.KeyParameter;

public class AesCipherKey implements CipherKey {
    private final KeyParameter key;

    public AesCipherKey(KeyParameter key) {
        this.key = key;
    }

    @Override
    public byte[] serialize() {
        return key.getKey();
    }

    @Override
    public KeyParameter unwrap() {
        return key;
    }
}
