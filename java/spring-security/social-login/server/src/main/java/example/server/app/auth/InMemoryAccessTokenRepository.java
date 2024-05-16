package example.server.app.auth;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryAccessTokenRepository implements AccessTokenRepository {

    private final Map<String, String> tokenMap;

    public InMemoryAccessTokenRepository() {
        this.tokenMap = new ConcurrentHashMap<>();
    }

    @Override
    public void save(String code, String token) {
        tokenMap.put(code, token);
    }

    @Override
    public String popToken(String code) {
        return tokenMap.remove(code);
    }
}
