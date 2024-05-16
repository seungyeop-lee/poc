package example.server.config.auth.oauth2;

import example.server.app.auth.AuthService;
import example.server.helper.jwt.JWTHelperManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MyOAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTHelperManager jwtHelperManager;
    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        MyOAuth2User oAuth2User = (MyOAuth2User) authentication.getPrincipal();
        String token = oAuth2User.toJwt(jwtHelperManager.getJwtBuilder());
        String code = UUID.randomUUID().toString();
        authService.saveToken(code, token);

        response.sendRedirect("http://localhost:3000/token?code=" + code);
    }
}
