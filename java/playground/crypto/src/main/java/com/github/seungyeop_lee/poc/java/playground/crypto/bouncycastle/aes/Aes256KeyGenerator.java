package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import com.github.seungyeop_lee.poc.java.playground.crypto.KeyGenerator;
import org.bouncycastle.crypto.CipherKeyGenerator;
import org.bouncycastle.crypto.KeyGenerationParameters;
import org.bouncycastle.crypto.params.KeyParameter;

import java.security.SecureRandom;

public class Aes256KeyGenerator implements KeyGenerator {
    @Override
    public AesCipherKey generateKey() {
        CipherKeyGenerator keyGen = new CipherKeyGenerator();
        keyGen.init(new KeyGenerationParameters(new SecureRandom(), 256));  // 256-bit AES key
        byte[] key = keyGen.generateKey();

        return new AesCipherKey(new KeyParameter(key));
    }

    @Override
    public AesCipherKey generateKeyFrom(byte[] serializedKey) {
        return new AesCipherKey(new KeyParameter(serializedKey));
    }
}
