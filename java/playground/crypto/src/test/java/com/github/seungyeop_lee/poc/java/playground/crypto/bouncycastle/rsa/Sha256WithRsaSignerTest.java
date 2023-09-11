package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class Sha256WithRsaSignerTest {
    @Test
    void signTest() {
        Sha256WithRsaSigner rsa = new Sha256WithRsaSigner();

        // Generate ECDSA key pair
        Rsa2048KeyGenerator keyGenerator = new Rsa2048KeyGenerator();
        RsaKeyPair keyPair = keyGenerator.generateKeyPair();
        RsaPrivateKey privateKey = keyPair.getPrivateKey();
        RsaPublicKey publicKey = keyPair.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        RsaPrivateKey deserializedPrivateKey = keyGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        RsaPublicKey deserializedPublicKey = keyGenerator.generatePublicKeyFrom(serializedPublicKey);

        // Sign data and verify signature
        String dataToSign = "Hello, world!";
        byte[] signature = rsa.sign(dataToSign.getBytes(), deserializedPrivateKey);
        boolean isVerified = rsa.verify(dataToSign.getBytes(), signature, deserializedPublicKey);

        // Test
        assertTrue(isVerified);
    }
}
