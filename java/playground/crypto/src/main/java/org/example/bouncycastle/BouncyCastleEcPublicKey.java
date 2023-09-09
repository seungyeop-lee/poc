package org.example.bouncycastle;

import org.bouncycastle.crypto.params.ECPublicKeyParameters;

public class BouncyCastleEcPublicKey {
    private final ECPublicKeyParameters key;

    public BouncyCastleEcPublicKey(ECPublicKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        return key.getQ().getEncoded(false);
    }

    public ECPublicKeyParameters unwrap() {
        return key;
    }
}
