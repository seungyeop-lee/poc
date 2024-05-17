package example.server.app.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final AccessTokenRepository accessTokenRepository;

    public void saveAccessToken(String code, TokenRecord token) {
        accessTokenRepository.save(code, token);
    }

    public TokenRecord getToken(String code) {
        return accessTokenRepository.getToken(code);
    }
}
