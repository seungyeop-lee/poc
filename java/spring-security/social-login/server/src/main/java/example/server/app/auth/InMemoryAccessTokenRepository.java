package example.server.app.auth;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryAccessTokenRepository implements AccessTokenRepository {

    private final Map<String, TokenRecord> tokenMap;

    public InMemoryAccessTokenRepository() {
        this.tokenMap = new ConcurrentHashMap<>();
    }

    @Override
    public void save(String code, TokenRecord token) {
        tokenMap.put(code, token);
    }

    @Override
    public TokenRecord getToken(String code) {
        return tokenMap.get(code);
    }
}
