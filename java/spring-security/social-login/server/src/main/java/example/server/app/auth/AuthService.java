package example.server.app.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final AccessTokenRepository accessTokenRepository;

    public void saveAccessToken(String code, String token) {
        accessTokenRepository.save(code, token);
    }

    public String popAccessToken(String code) {
        return accessTokenRepository.popToken(code);
    }
}
