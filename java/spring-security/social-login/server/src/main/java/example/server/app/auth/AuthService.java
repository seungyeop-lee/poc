package example.server.app.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;

    public void saveToken(String uuid, String token) {
        tokenRepository.save(uuid, token);
    }

    public String popToken(String uuid) {
        return tokenRepository.popToken(uuid);
    }
}
