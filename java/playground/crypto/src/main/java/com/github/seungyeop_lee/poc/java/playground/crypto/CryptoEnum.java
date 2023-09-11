package com.github.seungyeop_lee.poc.java.playground.crypto;

import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes.Aes256KeyGenerator;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.aes.AesCbcPkcs7Crypto;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec.EcKeyGenerator;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.ec.Sha256WithEcdsaSigner;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa.Rsa2048KeyGenerator;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa.RsaCrypto;
import com.github.seungyeop_lee.poc.java.playground.crypto.bouncycastle.rsa.Sha256WithRsaSigner;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.function.Supplier;

public class CryptoEnum {
    @Getter
    @RequiredArgsConstructor
    public enum SymmetricKey {
        AES256(Aes256KeyGenerator::new);

        private final Supplier<KeyGenerator> keyGeneratorSupplier;
    }

    @Getter
    @RequiredArgsConstructor
    public enum AsymmetricKey {
        EC_SECP256K1(EcKeyGenerator::new),
        RSA2048(Rsa2048KeyGenerator::new);

        private final Supplier<KeyPairGenerator> keyPairGeneratorSupplier;
    }

    @Getter
    @RequiredArgsConstructor
    public enum CryptoAlgorithm {
        AES_CBC_PKCS7(AesCbcPkcs7Crypto::new),
        RSA(RsaCrypto::new);

        private final Supplier<Crypto> cryptoSupplier;
    }

    @Getter
    @RequiredArgsConstructor
    public enum SignerAlgorithm {
        ECDSA(Sha256WithEcdsaSigner::new),
        RSA(Sha256WithRsaSigner::new);

        private final Supplier<Signer> signerSupplier;
    }
}
