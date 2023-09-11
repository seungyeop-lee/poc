package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import com.github.seungyeop_lee.poc.java.playground.crypto.Signer;
import org.bouncycastle.crypto.CryptoException;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.params.RSAKeyParameters;
import org.bouncycastle.crypto.params.RSAPrivateCrtKeyParameters;
import org.bouncycastle.crypto.signers.RSADigestSigner;

public class Sha256WithRsaSigner implements Signer {

    @Override
    public byte[] sign(byte[] data, CipherKey privateKey) {
        try {
            return doSign(data, (RSAPrivateCrtKeyParameters) privateKey.unwrap());
        } catch (CryptoException e) {
            throw new RuntimeException(e);
        }
    }

    private byte[] doSign(byte[] data, RSAPrivateCrtKeyParameters keyParameters) throws CryptoException {
        RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
        signer.init(true, keyParameters);
        signer.update(data, 0, data.length);
        return signer.generateSignature();
    }

    @Override
    public boolean verify(byte[] data, byte[] signature, CipherKey publicKey) {
        return doVerify(data, signature, (RSAKeyParameters) publicKey.unwrap());
    }

    private boolean doVerify(byte[] data, byte[] signature, RSAKeyParameters keyParameters) {
        RSADigestSigner signer = new RSADigestSigner(new SHA256Digest());
        signer.init(false, keyParameters);
        signer.update(data, 0, data.length);
        return signer.verifySignature(signature);
    }
}
