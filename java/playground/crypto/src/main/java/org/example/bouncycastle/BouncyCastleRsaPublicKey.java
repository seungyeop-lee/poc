package org.example.bouncycastle;

import org.bouncycastle.asn1.DERNull;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.pkcs.RSAPublicKey;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.crypto.params.RSAKeyParameters;

import java.io.IOException;

public class BouncyCastleRsaPublicKey {
    private final RSAKeyParameters key;

    public BouncyCastleRsaPublicKey(RSAKeyParameters key) {
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
