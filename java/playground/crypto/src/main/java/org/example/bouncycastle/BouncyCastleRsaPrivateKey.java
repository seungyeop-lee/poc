package org.example.bouncycastle;

import org.bouncycastle.asn1.DERNull;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.crypto.params.RSAPrivateCrtKeyParameters;

import java.io.IOException;

public class BouncyCastleRsaPrivateKey {
    private final RSAPrivateCrtKeyParameters key;

    public BouncyCastleRsaPrivateKey(RSAPrivateCrtKeyParameters key) {
        this.key = key;
    }

    public byte[] serialize() {
        try {
            PrivateKeyInfo pki = new PrivateKeyInfo(
                    new AlgorithmIdentifier(PKCSObjectIdentifiers.rsaEncryption, DERNull.INSTANCE),
                    new RSAPrivateKey(
                            key.getModulus(),
                            key.getPublicExponent(),
                            key.getExponent(),
                            key.getP(),
                            key.getQ(),
                            key.getDP(),
                            key.getDQ(),
                            key.getQInv()
                    )
            );
            return pki.getEncoded();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public RSAPrivateCrtKeyParameters unwrap() {
        return key;
    }
}
