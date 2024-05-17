package example.server.config.auth.jwt;

import example.server.config.auth.common.MyLoginUser;
import example.server.helper.jwt.JWTHelperManager;
import example.server.helper.jwt.JWTReader;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTHelperManager jwtHelperManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        JWTReader jwtReader = jwtHelperManager.getJwtReader(token);
        try {
            jwtReader.validate();
        } catch (Exception e) {
            log.error("JWT validation failed", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        OAuth2User oAuth2User = MyLoginUser.from(jwtReader);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = UsernamePasswordAuthenticationToken.authenticated(oAuth2User, null, oAuth2User.getAuthorities());

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    public String extractToken(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        if (accessToken == null) {
            return null;
        }

        String token = accessToken.replaceFirst("Bearer", "").trim();
        if (!StringUtils.hasText(token)) {
            return null;
        }

        return token;
    }
}
