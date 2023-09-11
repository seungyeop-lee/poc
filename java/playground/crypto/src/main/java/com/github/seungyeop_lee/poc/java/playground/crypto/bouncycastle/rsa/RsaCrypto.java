package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import org.bouncycastle.crypto.engines.RSAEngine;

public class RsaCrypto {
    public byte[] encrypt(byte[] data, RsaPublicKey key) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(true, key.unwrap());
        return rsaEngine.processBlock(data, 0, data.length);
    }

    public byte[] decrypt(byte[] data, RsaPrivateKey key) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(false, key.unwrap());
        return rsaEngine.processBlock(data, 0, data.length);
    }
}
