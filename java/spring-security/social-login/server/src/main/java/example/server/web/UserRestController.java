package example.server.web;

import example.server.app.user.UserService;
import example.server.config.auth.common.MyLoginUser;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequest request) {
        request.validate();
        userService.joinByLocalUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    @Data
    public static class JoinRequest {
        private String email;
        private String password;

        public void validate() {
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (password == null || password.isBlank()) {
                throw new IllegalArgumentException("Password is required");
            }
        }
    }

    @GetMapping("/my")
    public String myInfo() {
        MyLoginUser oAuth2User = (MyLoginUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return oAuth2User.toString();
    }
}
