package example.server.web;

import example.server.app.auth.AuthService;
import example.server.app.auth.TokenRecord;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthRestController {

    private final AuthService authService;

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
}
