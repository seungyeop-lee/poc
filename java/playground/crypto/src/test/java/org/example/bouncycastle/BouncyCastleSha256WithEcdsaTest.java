package org.example.bouncycastle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class BouncyCastleSha256WithEcdsaTest {
    @Test
    void cryptoTest() {
        BouncyCastleSha256WithEcdsa ecdsa = new BouncyCastleSha256WithEcdsa();

        // Generate ECDSA key pair
        BouncyCastleEcKeyManager keyManager = new BouncyCastleEcKeyManager();
        BouncyCastleEcPrivateKey privateKey = keyManager.getPrivateKey();
        BouncyCastleEcPublicKey publicKey = keyManager.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        BouncyCastleEcPrivateKey deserializedPrivateKey = keyManager.getPrivateKeyFrom(serializedPrivateKey);
        BouncyCastleEcPublicKey deserializedPublicKey = keyManager.getPublicKeyFrom(serializedPublicKey);

        // Sign data and verify signature
        String dataToSign = "Hello, world!";
        byte[] signature = ecdsa.sign(dataToSign.getBytes(), deserializedPrivateKey);
        boolean isVerified = ecdsa.verify(dataToSign.getBytes(), signature, deserializedPublicKey);

        // Test
        assertTrue(isVerified);
    }
}
