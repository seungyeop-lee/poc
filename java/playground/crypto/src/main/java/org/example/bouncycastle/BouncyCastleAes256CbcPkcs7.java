package org.example.bouncycastle;

import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.ParametersWithIV;

import java.security.SecureRandom;

public class BouncyCastleAes256CbcPkcs7 {

    public byte[] encrypt(byte[] data, BouncyCastleAes256Key key) throws Exception {
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[16]; // 128-bit IV
        random.nextBytes(iv);

        CipherParameters cipherParameters = new ParametersWithIV(key.unwrap(), iv);

        BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(CBCBlockCipher.newInstance(AESEngine.newInstance()));
        cipher.init(true, cipherParameters);

        byte[] encrypted = new byte[cipher.getOutputSize(data.length)];
        int outputLength = cipher.processBytes(data, 0, data.length, encrypted, 0);
        outputLength += cipher.doFinal(encrypted, outputLength);

        byte[] result = new byte[iv.length + outputLength];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(encrypted, 0, result, iv.length, outputLength);

        return result;
    }

    public byte[] decrypt(byte[] data, BouncyCastleAes256Key key) throws Exception {
        byte[] iv = new byte[16];
        System.arraycopy(data, 0, iv, 0, iv.length);

        CipherParameters cipherParameters = new ParametersWithIV(key.unwrap(), iv);

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
