package com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec;

import com.github.seungyeop_lee.poc.java.playground.crypto.CipherKey;
import com.github.seungyeop_lee.poc.java.playground.crypto.Signer;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.signers.ECDSASigner;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;

public class Sha256WithEcdsaSigner implements Signer {

    @Override
    public byte[] sign(byte[] data, CipherKey privateKey) {
        return doSign(data, (ECPrivateKeyParameters) privateKey.unwrap());
    }

    private byte[] doSign(byte[] data, ECPrivateKeyParameters keyParameters) {
        ECDSASigner signer = new ECDSASigner();
        signer.init(true, keyParameters);

        SHA256Digest digest = new SHA256Digest();
        digest.update(data, 0, data.length);
        byte[] hashedData = new byte[digest.getDigestSize()];
        digest.doFinal(hashedData, 0);

        BigInteger[] signature = signer.generateSignature(hashedData);

        ByteBuffer signatureBuffer = ByteBuffer.allocate(64); // Each BigInteger will occupy 32 bytes
        byte[] rByteArray = toArray(signature[0], 32);
        byte[] sByteArray = toArray(signature[1], 32);
        signatureBuffer.put(rByteArray);
        signatureBuffer.put(sByteArray);

        return signatureBuffer.array();
    }

    // Helper method to convert BigInteger to byte array size (32 byte length) for signature
    private byte[] toArray(BigInteger bi, int byteCount) {
        byte[] bytes = bi.toByteArray();
        if (bytes.length == byteCount) {
            return bytes;
        } else if (bytes.length < byteCount) {
            byte[] result = new byte[byteCount];
            Arrays.fill(result, (byte) 0x00);
            System.arraycopy(bytes, 0, result, byteCount - bytes.length, bytes.length);
            return result;
        } else {
            assert bytes.length == byteCount + 1;
            assert bytes[0] == 0x00;
            return Arrays.copyOfRange(bytes, 1, bytes.length);
        }
    }

    @Override
    public boolean verify(byte[] data, byte[] signature, CipherKey publicKey) {
        return doVerify(data, signature, (ECPublicKeyParameters) publicKey.unwrap());
    }

    private boolean doVerify(byte[] data, byte[] signatureBytes, ECPublicKeyParameters keyParameters) {
        ECDSASigner signer = new ECDSASigner();
        signer.init(false, keyParameters);

        SHA256Digest digest = new SHA256Digest();
        digest.update(data, 0, data.length);
        byte[] hashedData = new byte[digest.getDigestSize()];
        digest.doFinal(hashedData, 0);

        ByteBuffer signatureBuffer = ByteBuffer.wrap(signatureBytes);
        byte[] rBytes = new byte[32];
        byte[] sBytes = new byte[32];
        signatureBuffer.get(rBytes);
        signatureBuffer.get(sBytes);
        BigInteger r = new BigInteger(1, rBytes);
        BigInteger s = new BigInteger(1, sBytes);

        return signer.verifySignature(hashedData, r, s);
    }
}
