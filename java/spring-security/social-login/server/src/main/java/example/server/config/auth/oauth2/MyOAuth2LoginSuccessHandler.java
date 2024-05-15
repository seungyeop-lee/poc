package example.server.config.auth.oauth2;

import example.server.app.auth.AuthService;
import example.server.config.auth.jwt.JWTUtil;
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

    private final JWTUtil jwtUtil;
    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        MyOAuth2User customUserDetails = (MyOAuth2User) authentication.getPrincipal();
        String username = customUserDetails.getUsername();
        String token = jwtUtil.createJwt(username, 60 * 60 * 60L);
        String uuid = UUID.randomUUID().toString();
        authService.saveToken(uuid, token);
        
        response.sendRedirect("http://localhost:3000/token?uuid=" + uuid);
    }
}
