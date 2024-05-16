package example.server.config.auth.oauth2.successhandler;

import example.server.app.auth.AuthService;
import example.server.config.auth.model.MyOAuth2User;
import example.server.helper.jwt.JWTHelperManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MyOAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${service.oauth2.codeNoticeUrl}")
    private String codeNoticeUrl;

    private final JWTHelperManager jwtHelperManager;
    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        MyOAuth2User oAuth2User = (MyOAuth2User) authentication.getPrincipal();
        String token = oAuth2User.toAccessToken(jwtHelperManager.getJwtBuilder());
        String code = UUID.randomUUID().toString();
        authService.saveAccessToken(code, token);

        response.sendRedirect(String.format("%s?code=%s", codeNoticeUrl, code));
    }
}
