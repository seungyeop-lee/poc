package com.github.seungyeop_lee.poc.java.playground.crypto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CryptoFactoryTest {
    private final String plaintext = "Hello, world!";

    @Test
    void aesCryptoTest() {
        Crypto crypto = CryptoFactory.getCrypto(CryptoEnum.CryptoAlgorithm.AES_CBC_PKCS7);
        KeyGenerator keyGenerator = CryptoFactory.getKeyGenerator(CryptoEnum.SymmetricKey.AES256);

        // 키 생성
        CipherKey key = keyGenerator.generateKey();

        // 직렬화, 역직렬화
        byte[] serializedKey = key.serialize();
        CipherKey deserializedKey = keyGenerator.generateKeyFrom(serializedKey);

        // 암호화
        byte[] plaintextBytes = plaintext.getBytes();
        byte[] ciphertext = crypto.encrypt(plaintextBytes, deserializedKey);

        // 복호화
        byte[] decryptedTextBytes = crypto.decrypt(ciphertext, deserializedKey);
        String decryptedText = new String(decryptedTextBytes);

        assertEquals(plaintext, decryptedText);
    }

    @Test
    void rsaCryptoTest() {
        Crypto crypto = CryptoFactory.getCrypto(CryptoEnum.CryptoAlgorithm.RSA);
        KeyPairGenerator keyPairGenerator = CryptoFactory.getKeyPairGenerator(CryptoEnum.AsymmetricKey.RSA2048);

        // 키 생성
        CipherKeyPair keyPair = keyPairGenerator.generateKeyPair();
        CipherKey privateKey = keyPair.getPrivateKey();
        CipherKey publicKey = keyPair.getPublicKey();

        // 직렬화, 역직렬화
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        CipherKey deserializedPrivateKey = keyPairGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        CipherKey deserializedPublicKey = keyPairGenerator.generatePublicKeyFrom(serializedPublicKey);

        // 암호화, 복호화
        byte[] plaintextBytes = plaintext.getBytes();
        byte[] ciphertext = crypto.encrypt(plaintextBytes, deserializedPublicKey);
        byte[] decryptedTextBytes = crypto.decrypt(ciphertext, deserializedPrivateKey);
        String decryptedText = new String(decryptedTextBytes);

        assertEquals(plaintext, decryptedText);
    }

    @Test
    void ecdsaSignTest() {
        Signer signer = CryptoFactory.getSigner(CryptoEnum.SignerAlgorithm.ECDSA);
        KeyPairGenerator keyPairGenerator = CryptoFactory.getKeyPairGenerator(CryptoEnum.AsymmetricKey.EC_SECP256K1);

        // 키 생성
        CipherKeyPair keyPair = keyPairGenerator.generateKeyPair();
        CipherKey privateKey = keyPair.getPrivateKey();
        CipherKey publicKey = keyPair.getPublicKey();

        // 직렬화, 역직렬화
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        CipherKey deserializedPrivateKey = keyPairGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        CipherKey deserializedPublicKey = keyPairGenerator.generatePublicKeyFrom(serializedPublicKey);

        // 서명 및 검증
        byte[] signature = signer.sign(plaintext.getBytes(), deserializedPrivateKey);
        boolean isVerified = signer.verify(plaintext.getBytes(), signature, deserializedPublicKey);

        assertTrue(isVerified);
    }

    @Test
    void rsaSignTest() {
        Signer signer = CryptoFactory.getSigner(CryptoEnum.SignerAlgorithm.RSA);
        KeyPairGenerator keyPairGenerator = CryptoFactory.getKeyPairGenerator(CryptoEnum.AsymmetricKey.RSA2048);

        // 키 생성
        CipherKeyPair keyPair = keyPairGenerator.generateKeyPair();
        CipherKey privateKey = keyPair.getPrivateKey();
        CipherKey publicKey = keyPair.getPublicKey();

        // 직렬화, 역직렬화
        byte[] serializedPrivateKey = privateKey.serialize();
        byte[] serializedPublicKey = publicKey.serialize();
        CipherKey deserializedPrivateKey = keyPairGenerator.generatePrivateKeyFrom(serializedPrivateKey);
        CipherKey deserializedPublicKey = keyPairGenerator.generatePublicKeyFrom(serializedPublicKey);

        // 서명 및 검증
        byte[] signature = signer.sign(plaintext.getBytes(), deserializedPrivateKey);
        boolean isVerified = signer.verify(plaintext.getBytes(), signature, deserializedPublicKey);

        assertTrue(isVerified);
    }
}
