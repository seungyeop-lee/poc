package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import org.bouncycastle.crypto.CryptoException;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.signers.RSADigestSigner;

public class Sha256WithRsaSigner {

    public byte[] sign(byte[] data, RsaPrivateKey privateKey) {
        try {
            RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
            signer.init(true, privateKey.unwrap());
            signer.update(data, 0, data.length);
            return signer.generateSignature();
        } catch (CryptoException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verify(byte[] data, byte[] signature, RsaPublicKey publicKey) {
        RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
        signer.init(false, publicKey.unwrap());
        signer.update(data, 0, data.length);
        return signer.verifySignature(signature);
    }
}
