package org.example.bouncycastle;

import org.bouncycastle.crypto.CryptoException;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.signers.RSADigestSigner;

public class BouncyCastleSha256WithRsa {

    public byte[] sign(byte[] data, BouncyCastleRsaPrivateKey privateKey) {
        try {
            RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
            signer.init(true, privateKey.unwrap());
            signer.update(data, 0, data.length);
            return signer.generateSignature();
        } catch (CryptoException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verify(byte[] data, byte[] signature, BouncyCastleRsaPublicKey publicKey) {
        RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
        signer.init(false, publicKey.unwrap());
        signer.update(data, 0, data.length);
        return signer.verifySignature(signature);
    }
}
