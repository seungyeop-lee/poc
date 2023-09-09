package org.example.bouncycastle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BouncyCastleSha256WithRsaTest {
    @Test
    void cryptoTest() {
        BouncyCastleSha256WithRsa rsa = new BouncyCastleSha256WithRsa();

        // Generate ECDSA key pair
        BouncyCastleRsaKeyManager keyManager = new BouncyCastleRsaKeyManager();
        BouncyCastleRsaPrivateKey privateKey = keyManager.getPrivateKey();
        BouncyCastleRsaPublicKey publicKey = keyManager.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        BouncyCastleRsaPrivateKey deserializedPrivateKey = keyManager.getPrivateKeyFrom(serializedPrivateKey);
        BouncyCastleRsaPublicKey deserializedPublicKey = keyManager.getPublicKeyFrom(serializedPublicKey);

        // Sign data and verify signature
        String dataToSign = "Hello, world!";
        byte[] signature = rsa.sign(dataToSign.getBytes(), deserializedPrivateKey);
        boolean isVerified = rsa.verify(dataToSign.getBytes(), signature, deserializedPublicKey);

        // Test
        assertTrue(isVerified);
    }
}
