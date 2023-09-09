package org.example.bouncycastle;

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

public class BouncyCastleRsaKeyManager {

    private AsymmetricCipherKeyPair keyPair;

    public BouncyCastleRsaPrivateKey getPrivateKey() {
        if (keyPair == null) {
            keyPair = generateKeyPair();
        }
        return new BouncyCastleRsaPrivateKey((RSAPrivateCrtKeyParameters) keyPair.getPrivate());
    }

    public BouncyCastleRsaPublicKey getPublicKey() {
        if (keyPair == null) {
            keyPair = generateKeyPair();
        }
        return new BouncyCastleRsaPublicKey((RSAKeyParameters) keyPair.getPublic());
    }

    public BouncyCastleRsaPrivateKey getPrivateKeyFrom(byte[] serializedKey) {
        try {
            RSAPrivateCrtKeyParameters key = (RSAPrivateCrtKeyParameters) PrivateKeyFactory.createKey(serializedKey);
            return new BouncyCastleRsaPrivateKey(key);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public BouncyCastleRsaPublicKey getPublicKeyFrom(byte[] serializedKey) {
        try {
            RSAKeyParameters key = (RSAKeyParameters) PublicKeyFactory.createKey(serializedKey);
            return new BouncyCastleRsaPublicKey(key);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static AsymmetricCipherKeyPair generateKeyPair() {
        RSAKeyPairGenerator keyPairGenerator = new RSAKeyPairGenerator();
        RSAKeyGenerationParameters params = new RSAKeyGenerationParameters(
                BigInteger.valueOf(65537), new SecureRandom(), 2048, 12);
        keyPairGenerator.init(params);
        return keyPairGenerator.generateKeyPair();
    }
}
