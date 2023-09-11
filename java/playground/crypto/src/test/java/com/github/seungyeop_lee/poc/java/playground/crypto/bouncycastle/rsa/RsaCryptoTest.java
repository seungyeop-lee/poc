package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RsaCryptoTest {
    @Test
    void cryptoTest() {
        RsaCrypto rsa = new RsaCrypto();

        // Generate RSA Key Pair
        Rsa2048KeyGenerator keyGenerator = new Rsa2048KeyGenerator();
        RsaKeyPair keyPair = keyGenerator.generateKeyPair();
        RsaPrivateKey privateKey = keyPair.getPrivateKey();
        RsaPublicKey publicKey = keyPair.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        RsaPrivateKey deserializedPrivateKey = keyGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        RsaPublicKey deserializedPublicKey = keyGenerator.generatePublicKeyFrom(serializedPublicKey);

        // Test Encryption and Decryption
        String plaintext = "Hello, world!";
        byte[] plaintextBytes = plaintext.getBytes();
        byte[] ciphertext = rsa.encrypt(plaintextBytes, deserializedPublicKey);
        byte[] decryptedTextBytes = rsa.decrypt(ciphertext, deserializedPrivateKey);
        String decryptedText = new String(decryptedTextBytes);

        assertEquals(plaintext, decryptedText);
    }
}
