package example.server.app.auth;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenRepository {

    private final Map<String, String> tokenMap;

    public TokenRepository() {
        this.tokenMap = new ConcurrentHashMap<>();
    }

    public void save(String uuid, String token) {
        tokenMap.put(uuid, token);
    }

    public String popToken(String uuid) {
        return tokenMap.remove(uuid);
    }
}
