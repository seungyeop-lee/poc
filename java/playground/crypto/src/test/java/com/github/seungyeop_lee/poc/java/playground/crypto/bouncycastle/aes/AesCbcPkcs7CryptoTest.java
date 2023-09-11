package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AesCbcPkcs7CryptoTest {
    @Test
    void cryptoTest() throws Exception {
        AesCbcPkcs7Crypto aes = new AesCbcPkcs7Crypto();

        Aes256KeyGenerator keyGenerator = new Aes256KeyGenerator();
        AesCipherKey key = keyGenerator.generateKey();

        byte[] serializedKey = key.serialize();
        AesCipherKey deserializedKey = keyGenerator.generateKeyFrom(serializedKey);

        // Encryption
        String plaintext = "Hello, world!";
        byte[] plaintextBytes = plaintext.getBytes();
        byte[] ciphertext = aes.encrypt(plaintextBytes, deserializedKey);

        // Decryption
        byte[] decryptedTextBytes = aes.decrypt(ciphertext, deserializedKey);
        String decryptedText = new String(decryptedTextBytes);

        assertEquals(plaintext, decryptedText);
    }
}
