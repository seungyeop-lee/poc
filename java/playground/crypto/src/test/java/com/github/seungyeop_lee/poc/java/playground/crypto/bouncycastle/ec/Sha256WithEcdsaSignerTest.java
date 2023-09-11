package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class Sha256WithEcdsaSignerTest {
    @Test
    void signTest() {
        Sha256WithEcdsaSigner ecdsa = new Sha256WithEcdsaSigner();

        // Generate ECDSA key pair
        EcKeyGenerator keyGenerator = new EcKeyGenerator();
        EcKeyPair keyPair = keyGenerator.generateKeyPair();
        EcPrivateKey privateKey = keyPair.getPrivateKey();
        EcPublicKey publicKey = keyPair.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        EcPrivateKey deserializedPrivateKey = keyGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        EcPublicKey deserializedPublicKey = keyGenerator.generatePublicKeyFrom(serializedPublicKey);

        // Sign data and verify signature
        String dataToSign = "Hello, world!";
        byte[] signature = ecdsa.sign(dataToSign.getBytes(), deserializedPrivateKey);
        boolean isVerified = ecdsa.verify(dataToSign.getBytes(), signature, deserializedPublicKey);

        // Test
        assertTrue(isVerified);
    }
}
