package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import com.github.seungyeop_lee.poc.java.playground.crypto.Crypto;
import org.bouncycastle.crypto.engines.RSAEngine;
import org.bouncycastle.crypto.params.RSAKeyParameters;
import org.bouncycastle.crypto.params.RSAPrivateCrtKeyParameters;

public class RsaCrypto implements Crypto {
    @Override
    public byte[] encrypt(byte[] plainData, CipherKey key) {
        return doEncrypt(plainData, (RSAKeyParameters) key.unwrap());
    }

    private byte[] doEncrypt(byte[] plainData, RSAKeyParameters keyParameters) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(true, keyParameters);
        return rsaEngine.processBlock(plainData, 0, plainData.length);
    }

    @Override
    public byte[] decrypt(byte[] encryptedData, CipherKey key) {
        return doDecrypt(encryptedData, (RSAPrivateCrtKeyParameters) key.unwrap());
    }

    private byte[] doDecrypt(byte[] encryptedData, RSAPrivateCrtKeyParameters keyParameters) {
        RSAEngine rsaEngine = new RSAEngine();
        rsaEngine.init(false, keyParameters);
        return rsaEngine.processBlock(encryptedData, 0, encryptedData.length);
    }
}
