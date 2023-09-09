package org.example.bouncycastle;

import org.bouncycastle.crypto.CipherKeyGenerator;
import org.bouncycastle.crypto.KeyGenerationParameters;
import org.bouncycastle.crypto.params.KeyParameter;

import java.security.SecureRandom;

public class BouncyCastleAes256KeyManager {
    public BouncyCastleAes256Key generateKey() {
        CipherKeyGenerator keyGen = new CipherKeyGenerator();
        SecureRandom random = new SecureRandom();
        keyGen.init(new KeyGenerationParameters(random, 256));  // 256-bit AES key
        byte[] key = keyGen.generateKey();
        return new BouncyCastleAes256Key(new KeyParameter(key));
    }

    public BouncyCastleAes256Key generateKeyFrom(byte[] serializedKey) {
        return new BouncyCastleAes256Key(new KeyParameter(serializedKey));
    }
}
