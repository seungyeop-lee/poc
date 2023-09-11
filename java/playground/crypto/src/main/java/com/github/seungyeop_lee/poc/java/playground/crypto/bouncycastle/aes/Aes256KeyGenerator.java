package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import org.bouncycastle.crypto.CipherKeyGenerator;
import org.bouncycastle.crypto.KeyGenerationParameters;
import org.bouncycastle.crypto.params.KeyParameter;

import java.security.SecureRandom;

public class Aes256KeyGenerator {
    public AesCipherKey generateKey() {
        CipherKeyGenerator keyGen = new CipherKeyGenerator();
        SecureRandom random = new SecureRandom();
        keyGen.init(new KeyGenerationParameters(random, 256));  // 256-bit AES key
        byte[] key = keyGen.generateKey();
        return new AesCipherKey(new KeyParameter(key));
    }

    public AesCipherKey generateKeyFrom(byte[] serializedKey) {
        return new AesCipherKey(new KeyParameter(serializedKey));
    }
}
