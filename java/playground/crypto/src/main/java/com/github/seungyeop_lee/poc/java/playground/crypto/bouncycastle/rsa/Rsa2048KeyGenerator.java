package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import com.github.seungyeop_lee.poc.java.playground.crypto.KeyPairGenerator;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.generators.RSAKeyPairGenerator;
import org.bouncycastle.crypto.params.RSAKeyGenerationParameters;
import org.bouncycastle.crypto.params.RSAKeyParameters;
import org.bouncycastle.crypto.params.RSAPrivateCrtKeyParameters;
import org.bouncycastle.crypto.util.PrivateKeyFactory;
import org.bouncycastle.crypto.util.PublicKeyFactory;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;

public class Rsa2048KeyGenerator implements KeyPairGenerator {

    @Override
    public RsaKeyPair generateKeyPair() {
        AsymmetricCipherKeyPair keyPair = generateBouncyCastleKeyPair();
        return new RsaKeyPair(
                new RsaPrivateKey((RSAPrivateCrtKeyParameters) keyPair.getPrivate()),
                new RsaPublicKey((RSAKeyParameters) keyPair.getPublic())
        );
    }

    @Override
    public RsaPrivateKey generatePrivateKeyFrom(byte[] serializedKey) {
        try {
            RSAPrivateCrtKeyParameters key = (RSAPrivateCrtKeyParameters) PrivateKeyFactory.createKey(serializedKey);
            return new RsaPrivateKey(key);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public RsaPublicKey generatePublicKeyFrom(byte[] serializedKey) {
        try {
            RSAKeyParameters key = (RSAKeyParameters) PublicKeyFactory.createKey(serializedKey);
            return new RsaPublicKey(key);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static AsymmetricCipherKeyPair generateBouncyCastleKeyPair() {
        RSAKeyPairGenerator keyPairGenerator = new RSAKeyPairGenerator();
        RSAKeyGenerationParameters params = new RSAKeyGenerationParameters(
                BigInteger.valueOf(65537), new SecureRandom(), 2048, 12);
        keyPairGenerator.init(params);
        return keyPairGenerator.generateKeyPair();
    }
}
