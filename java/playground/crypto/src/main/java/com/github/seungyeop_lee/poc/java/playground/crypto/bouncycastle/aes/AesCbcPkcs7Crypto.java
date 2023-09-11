package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import com.github.seungyeop_lee.poc.java.playground.crypto.Crypto;
import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;

import java.security.SecureRandom;

public class AesCbcPkcs7Crypto implements Crypto {

    @Override
    public byte[] encrypt(byte[] plainData, CipherKey key) {
        try {
            return doEncrypt(plainData, (KeyParameter) key.unwrap());
        } catch (InvalidCipherTextException e) {
            throw new RuntimeException(e);
        }
    }

    private byte[] doEncrypt(byte[] plainData, KeyParameter keyParameter) throws InvalidCipherTextException {
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[16]; // 128-bit IV
        random.nextBytes(iv);

        CipherParameters cipherParameters = new ParametersWithIV(keyParameter, iv);

        BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(CBCBlockCipher.newInstance(AESEngine.newInstance()));
        cipher.init(true, cipherParameters);

        byte[] encrypted = new byte[cipher.getOutputSize(plainData.length)];
        int outputLength = cipher.processBytes(plainData, 0, plainData.length, encrypted, 0);
        outputLength += cipher.doFinal(encrypted, outputLength);

        byte[] result = new byte[iv.length + outputLength];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(encrypted, 0, result, iv.length, outputLength);

        return result;
    }

    @Override
    public byte[] decrypt(byte[] encryptedData, CipherKey key) {
        try {
            return doDecrypt(encryptedData, (KeyParameter) key.unwrap());
        } catch (InvalidCipherTextException e) {
            throw new RuntimeException(e);
        }
    }

    private byte[] doDecrypt(byte[] data, KeyParameter keyParameter) throws InvalidCipherTextException {
        byte[] iv = new byte[16];
        System.arraycopy(data, 0, iv, 0, iv.length);

        CipherParameters cipherParameters = new ParametersWithIV(keyParameter, iv);

        BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(CBCBlockCipher.newInstance(AESEngine.newInstance()));
        cipher.init(false, cipherParameters);

        byte[] encrypted = new byte[data.length - iv.length];
        System.arraycopy(data, iv.length, encrypted, 0, encrypted.length);

        byte[] decrypted = new byte[cipher.getOutputSize(encrypted.length)];
        int outputLength = cipher.processBytes(encrypted, 0, encrypted.length, decrypted, 0);
        outputLength += cipher.doFinal(decrypted, outputLength);

        // Remove padding bytes
        byte[] finalDecrypted = new byte[outputLength];
        System.arraycopy(decrypted, 0, finalDecrypted, 0, outputLength);

        return finalDecrypted;
    }
}
