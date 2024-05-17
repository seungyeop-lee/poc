package example.server.config.auth.common;

import example.server.app.auth.AuthService;
import example.server.app.auth.TokenRecord;
import example.server.helper.jwt.JWTHelperManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${service.oauth2.codeNoticeUrl}")
    private String codeNoticeUrl;

    private final JWTHelperManager jwtHelperManager;
    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        MyLoginUser oAuth2User = (MyLoginUser) authentication.getPrincipal();
        String accessToken = oAuth2User.toAccessToken(jwtHelperManager.getJwtBuilder());
        String refreshToken = oAuth2User.toRefreshToken(jwtHelperManager.getJwtBuilder());
        String code = UUID.randomUUID().toString();
        authService.saveAccessToken(code, new TokenRecord(accessToken, refreshToken));

        response.sendRedirect(String.format("%s?code=%s", codeNoticeUrl, code));
    }
}
