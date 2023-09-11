package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

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

public class EcKeyGenerator {

    private final ECDomainParameters ecDP;

    public EcKeyGenerator() {
        this("secp256k1");
    }

    public EcKeyGenerator(String secNameCurve) {
        X9ECParameters ecP = SECNamedCurves.getByName(secNameCurve);
        ecDP = new ECDomainParameters(ecP.getCurve(), ecP.getG(), ecP.getN(), ecP.getH());
    }

    public EcKeyPair generateKeyPair() {
        AsymmetricCipherKeyPair keyPair = generateKeyPair(ecDP);
        return new EcKeyPair(
                new EcPrivateKey((ECPrivateKeyParameters) keyPair.getPrivate()),
                new EcPublicKey((ECPublicKeyParameters) keyPair.getPublic())
        );
    }

    private static AsymmetricCipherKeyPair generateKeyPair(ECDomainParameters ecDP) {
        ECKeyPairGenerator generator = new ECKeyPairGenerator();
        generator.init(new ECKeyGenerationParameters(ecDP, new SecureRandom()));
        return generator.generateKeyPair();
    }

    public EcPrivateKey generatePrivateKeyFrom(byte[] serializedKey) {
        BigInteger privKey = new BigInteger(1, serializedKey);
        ECPrivateKeyParameters keyParameters = new ECPrivateKeyParameters(privKey, ecDP);
        return new EcPrivateKey(keyParameters);
    }

    public EcPublicKey generatePublicKeyFrom(byte[] serializedKey) {
        ECPublicKeyParameters keyParameters = new ECPublicKeyParameters(ecDP.getCurve().decodePoint(serializedKey), ecDP);
        return new EcPublicKey(keyParameters);
    }
}
