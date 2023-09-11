package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import org.bouncycastle.asn1.DERNull;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.crypto.params.RSAPrivateCrtKeyParameters;

import java.io.IOException;

public class RsaPrivateKey implements CipherKey {
    private final RSAPrivateCrtKeyParameters key;

    public RsaPrivateKey(RSAPrivateCrtKeyParameters key) {
        this.key = key;
    }

    @Override
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

    @Override
    public RSAPrivateCrtKeyParameters unwrap() {
        return key;
    }
}
