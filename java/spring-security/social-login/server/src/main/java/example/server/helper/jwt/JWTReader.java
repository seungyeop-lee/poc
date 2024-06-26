package example.server.helper.jwt;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.Map;

public class JWTReader extends JWTHelper {

    private JWSVerifier verifier;
    private SignedJWT signedJWT;

    static JWTReader of(String secret, String token) {
        return run(() -> {
            JWTReader reader = new JWTReader();
            byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
            reader.verifier = new MACVerifier(secretBytes);
            reader.signedJWT = SignedJWT.parse(token);
            return reader;
        });
    }

    public void validate() {
        run(() -> {
            if (!signedJWT.verify(verifier)) {
                throw new IllegalArgumentException("JWT의 서명이 올바르지 않습니다.");
            }

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime.before(new Date())) {
                throw new IllegalArgumentException("JWT가 만료되었습니다.");
            }

            return null;
        });
    }

    public String getClaim(String claimName) {
        return run(() -> signedJWT.getJWTClaimsSet().getStringClaim(claimName));
    }

    public String getParsedString() {
        return run(
                () -> {
                    Map<String, Object> jsonObject = signedJWT.getPayload().toJSONObject();
                    String iatFormatted = LocalDateTime.ofEpochSecond((Long) jsonObject.get("iat"), 0, ZoneOffset.UTC).toString();
                    jsonObject.put("iat", iatFormatted);
                    String expFormatted = LocalDateTime.ofEpochSecond((Long) jsonObject.get("exp"), 0, ZoneOffset.UTC).toString();
                    jsonObject.put("exp", expFormatted);
                    return jsonObject.toString();
                }
        );
    }

    public static class Builder {

        private final String secret;

        public Builder(String jwtSecret) {
            this.secret = jwtSecret;
        }

        public JWTReader build(String token) {
            return JWTReader.of(secret, token);
        }
    }
}
