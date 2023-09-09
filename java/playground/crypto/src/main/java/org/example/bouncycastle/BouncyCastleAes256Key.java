package org.example.bouncycastle;

import org.bouncycastle.crypto.params.KeyParameter;

public class BouncyCastleAes256Key {
    private final KeyParameter key;

    public BouncyCastleAes256Key(KeyParameter key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getKey();
    }

    public KeyParameter unwrap() {
        return key;
    }
}
