package org.example.bouncycastle;

import org.bouncycastle.asn1.sec.SECNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.generators.ECKeyPairGenerator;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.crypto.params.ECKeyGenerationParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;

import java.math.BigInteger;
import java.security.SecureRandom;

public class BouncyCastleEcKeyManager {

    private final ECDomainParameters ecDP;
    private AsymmetricCipherKeyPair keyPair;

    public BouncyCastleEcKeyManager() {
        this("secp256k1");
    }

    public BouncyCastleEcKeyManager(String secNameCurve) {
        X9ECParameters ecP = SECNamedCurves.getByName(secNameCurve);
        ecDP = new ECDomainParameters(ecP.getCurve(), ecP.getG(), ecP.getN(), ecP.getH());
    }

    public BouncyCastleEcPrivateKey getPrivateKey() {
        if (keyPair == null) {
            keyPair = generateKeyPair(ecDP);
        }
        return new BouncyCastleEcPrivateKey((ECPrivateKeyParameters) keyPair.getPrivate());
    }

    public BouncyCastleEcPublicKey getPublicKey() {
        if (keyPair == null) {
            keyPair = generateKeyPair(ecDP);
        }
        return new BouncyCastleEcPublicKey((ECPublicKeyParameters) keyPair.getPublic());
    }

    private static AsymmetricCipherKeyPair generateKeyPair(ECDomainParameters ecDP) {
        ECKeyPairGenerator generator = new ECKeyPairGenerator();
        generator.init(new ECKeyGenerationParameters(ecDP, new SecureRandom()));
        return generator.generateKeyPair();
    }

    public BouncyCastleEcPrivateKey getPrivateKeyFrom(byte[] serializedKey) {
        BigInteger privKey = new BigInteger(1, serializedKey);
        ECPrivateKeyParameters keyParameters = new ECPrivateKeyParameters(privKey, ecDP);
        return new BouncyCastleEcPrivateKey(keyParameters);
    }

    public BouncyCastleEcPublicKey getPublicKeyFrom(byte[] serializedKey) {
        ECPublicKeyParameters keyParameters = new ECPublicKeyParameters(ecDP.getCurve().decodePoint(serializedKey), ecDP);
        return new BouncyCastleEcPublicKey(keyParameters);
    }
}
