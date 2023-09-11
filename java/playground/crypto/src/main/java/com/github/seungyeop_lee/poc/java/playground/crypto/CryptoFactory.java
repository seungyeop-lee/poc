package com.github.seungyeop_lee.poc.java.playground.crypto;

public class CryptoFactory {
    public static KeyGenerator getKeyGenerator(CryptoEnum.SymmetricKey symmetricKey) {
        return symmetricKey.getKeyGeneratorSupplier().get();
    }

    public static KeyPairGenerator getKeyPairGenerator(CryptoEnum.AsymmetricKey asymmetricKey) {
        return asymmetricKey.getKeyPairGeneratorSupplier().get();
    }

    public static Crypto getCrypto(CryptoEnum.CryptoAlgorithm cryptoAlgorithm) {
        return cryptoAlgorithm.getCryptoSupplier().get();
    }

    public static Signer getSigner(CryptoEnum.SignerAlgorithm signerAlgorithm) {
        return signerAlgorithm.getSignerSupplier().get();
    }
}
