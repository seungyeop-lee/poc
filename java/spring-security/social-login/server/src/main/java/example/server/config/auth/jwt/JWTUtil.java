package example.server.config.auth.jwt;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.Date;

@Component
public class JWTUtil {

    private final MACSigner signer;
    private final MACVerifier verifier;

    public JWTUtil(
            @Value("${service.jwt.secret}") String secret
    ) throws JOSEException {
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signer = new MACSigner(secretBytes);
        this.verifier = new MACVerifier(secretBytes);
    }

    public String getUid(String token) {
        return run(() -> getClaim(token, "uid"));
    }

    public String getProvider(String token) {
        return run(() -> getClaim(token, "provider"));
    }

    public String getName(String token) {
        return run(() -> getClaim(token, "name"));
    }

    public String getEmail(String token) {
        return run(() -> getClaim(token, "email"));
    }

    private String getClaim(String token, String username) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        if (!signedJWT.verify(verifier)) {
            throw new IllegalArgumentException("JWT signature does not match locally computed signature");
        }
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
        return claimsSet.getStringClaim(username);
    }

    public Boolean isExpired(String token) {
        return run(() -> {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();
            return expirationTime.before(new Date());
        });
    }

    public String createJwt(UserInfo userInfo, Long expiredMs) {
        return run(() -> {
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .claim("uid", userInfo.uid)
                    .claim("provider", userInfo.provider)
                    .claim("name", userInfo.name)
                    .claim("email", userInfo.email)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expiredMs))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claimsSet
            );

            signedJWT.sign(signer);

            return signedJWT.serialize();
        });
    }

    public record UserInfo(
            String uid,
            String provider,
            String name,
            String email
    ) {
    }

    private static <T> T run(CheckedSupplier<T> supplier) {
        try {
            return supplier.get();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private interface CheckedSupplier<T> {
        T get() throws Exception;
    }
}
