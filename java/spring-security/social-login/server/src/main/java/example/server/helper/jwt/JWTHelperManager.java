package example.server.helper.jwt;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTHelperManager {

    @Value("${service.jwt.secret}")
    private String jwtSecret;

    private JWTWriter.Builder jwtWriterBuilder;
    private JWTReader.Builder jwtReaderBuilder;

    @PostConstruct
    public void init() {
        jwtWriterBuilder = new JWTWriter.Builder(jwtSecret);
        jwtReaderBuilder = new JWTReader.Builder(jwtSecret);
    }

    public JWTWriter getJwtWriter() {
        return jwtWriterBuilder.build();
    }

    public JWTReader getJwtReader(String token) {
        return jwtReaderBuilder.build(token);
    }
}
