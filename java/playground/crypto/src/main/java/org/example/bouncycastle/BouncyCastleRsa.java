package org.example.bouncycastle;

import org.bouncycastle.crypto.engines.RSAEngine;

public class BouncyCastleRsa {
    public byte[] encrypt(byte[] data, BouncyCastleRsaPublicKey key) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(true, key.unwrap());
        return rsaEngine.processBlock(data, 0, data.length);
    }

    public byte[] decrypt(byte[] data, BouncyCastleRsaPrivateKey key) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(false, key.unwrap());
        return rsaEngine.processBlock(data, 0, data.length);
    }
}
