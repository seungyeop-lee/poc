package org.example.bouncycastle;

import org.bouncycastle.crypto.params.ECPrivateKeyParameters;

public class BouncyCastleEcPrivateKey {
    private final ECPrivateKeyParameters key;

    public BouncyCastleEcPrivateKey(ECPrivateKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getD().toByteArray();
    }

    public ECPrivateKeyParameters unwrap() {
        return key;
    }
}
