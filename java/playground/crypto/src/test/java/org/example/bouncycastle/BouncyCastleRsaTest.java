package org.example.bouncycastle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BouncyCastleRsaTest {
    @Test
    void cryptoTest() {
        BouncyCastleRsa rsa = new BouncyCastleRsa();

        // Generate RSA Key Pair
        BouncyCastleRsaKeyManager keyManager = new BouncyCastleRsaKeyManager();
        BouncyCastleRsaPrivateKey privateKey = keyManager.getPrivateKey();
        BouncyCastleRsaPublicKey publicKey = keyManager.getPublicKey();

        // Serialize and Deserialize key pair
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        BouncyCastleRsaPrivateKey deserializedPrivateKey = keyManager.getPrivateKeyFrom(serializedPrivateKey);
        BouncyCastleRsaPublicKey deserializedPublicKey = keyManager.getPublicKeyFrom(serializedPublicKey);

        // Test Encryption and Decryption
        String plaintext = "Hello, world!";
        byte[] plaintextBytes = plaintext.getBytes();
        byte[] ciphertext = rsa.encrypt(plaintextBytes, deserializedPublicKey);
        byte[] decryptedTextBytes = rsa.decrypt(ciphertext, deserializedPrivateKey);
        String decryptedText = new String(decryptedTextBytes);

        assertEquals(plaintext, decryptedText);
    }
}
