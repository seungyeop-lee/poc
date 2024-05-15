package example.server.app.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;

    public void saveToken(String code, String token) {
        tokenRepository.save(code, token);
    }

    public String popToken(String code) {
        return tokenRepository.popToken(code);
    }
}
