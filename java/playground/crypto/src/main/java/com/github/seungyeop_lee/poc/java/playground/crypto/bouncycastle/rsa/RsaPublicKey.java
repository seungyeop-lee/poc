package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import org.bouncycastle.asn1.DERNull;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.pkcs.RSAPublicKey;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.crypto.params.RSAKeyParameters;

import java.io.IOException;

public class RsaPublicKey {
    private final RSAKeyParameters key;

    public RsaPublicKey(RSAKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        try {
            SubjectPublicKeyInfo spki = new SubjectPublicKeyInfo(
                    new AlgorithmIdentifier(PKCSObjectIdentifiers.rsaEncryption, DERNull.INSTANCE),
                    new RSAPublicKey(key.getModulus(), key.getExponent())
            );
            return spki.getEncoded();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public RSAKeyParameters unwrap() {
        return key;
    }
}
