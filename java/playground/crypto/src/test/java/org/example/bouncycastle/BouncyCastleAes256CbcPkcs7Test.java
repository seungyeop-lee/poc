package org.example.bouncycastle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BouncyCastleAes256CbcPkcs7Test {
    @Test
    void cryptoTest() throws Exception {
        BouncyCastleAes256CbcPkcs7 aes = new BouncyCastleAes256CbcPkcs7();

        BouncyCastleAes256KeyManager keyManager = new BouncyCastleAes256KeyManager();
        BouncyCastleAes256Key key = keyManager.generateKey();

        byte[] serializedKey = key.serialize();
        BouncyCastleAes256Key deserializedKey = keyManager.generateKeyFrom(serializedKey);

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
