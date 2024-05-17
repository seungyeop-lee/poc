package example.server.web;

import example.server.app.auth.AuthService;
import example.server.app.auth.TokenRecord;
import example.server.helper.jwt.JWTBuilder;
import example.server.helper.jwt.JWTHelperManager;
import example.server.helper.jwt.JWTReader;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthRestController {

    @Value("${service.oauth2.accessTokenExpiredMinute}")
    private Integer accessTokenExpiredMinute;

    @Value("${service.oauth2.refreshTokenExpiredMinute}")
    private Integer refreshTokenExpiredMinute;

    private final AuthService authService;
    private final JWTHelperManager jwtHelperManager;

    @GetMapping("/token")
    public ResponseEntity<Void> getToken(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        TokenRecord token = authService.getToken(code);
        response.setHeader("Authorization", token.access());
        response.setHeader("X-Refresh-Authorization", token.refresh());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/token/info")
    public ResponseEntity<String> getTokenInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String jwtParsedString = (String) authentication.getDetails();
        return ResponseEntity.ok(jwtParsedString);
    }

    @GetMapping("/refresh")
    public ResponseEntity<Void> refreshToken(
            @RequestHeader("X-Refresh-Authorization") String refresh,
            HttpServletResponse response
    ) {
        JWTReader jwtReader = jwtHelperManager.getJwtReader(refresh);
        jwtReader.validate();

        if (!"refresh".equals(jwtReader.getClaim("category"))) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        JWTBuilder baseJwtBuilder = jwtHelperManager.getJwtBuilder();
        baseJwtBuilder.withClaim("uid", jwtReader.getClaim("uid"));
        baseJwtBuilder.withClaim("provider", jwtReader.getClaim("provider"));
        baseJwtBuilder.withClaim("name", jwtReader.getClaim("name"));
        baseJwtBuilder.withClaim("email", jwtReader.getClaim("email"));

        String accessToken = baseJwtBuilder
                .withClaim("category", "access")
                .withExpiredMs(1000L * 60 * accessTokenExpiredMinute)
                .build();

        String refreshToken = baseJwtBuilder
                .withClaim("category", "refresh")
                .withExpiredMs(1000L * 60 * refreshTokenExpiredMinute)
                .build();

        response.setHeader("Authorization", accessToken);
        response.setHeader("X-Refresh-Authorization", refreshToken);
        return ResponseEntity.ok().build();
    }
}
