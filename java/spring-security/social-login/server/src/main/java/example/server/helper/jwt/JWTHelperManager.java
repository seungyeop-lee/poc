package example.server.helper.jwt;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTHelperManager {

    @Value("${service.jwt.secret}")
    private String jwtSecret;

    private JWTBuilder jwtBuilder;
    private JWTReader.Builder jwtReaderBuilder;

    @PostConstruct
    public void init() {
        jwtBuilder = JWTBuilder.of(jwtSecret);
        jwtReaderBuilder = new JWTReader.Builder(jwtSecret);
    }

    public JWTBuilder getJwtBuilder() {
        return jwtBuilder;
    }

    public JWTReader getJwtReader(String token) {
        return jwtReaderBuilder.build(token);
    }
}
