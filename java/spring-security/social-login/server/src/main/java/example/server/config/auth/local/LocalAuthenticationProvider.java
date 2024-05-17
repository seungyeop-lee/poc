package example.server.config.auth.local;

import example.server.app.user.UserService;
import example.server.config.auth.common.MyLoginUser;
import example.server.model.LocalUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class LocalAuthenticationProvider implements AuthenticationProvider {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = (String) authentication.getPrincipal();

        LocalUser user = userService.findLocalUserByEmail(email).orElseThrow(NotExistEmailException::new);
        String inputPassword = (String) authentication.getCredentials();
        if (!passwordEncoder.matches(inputPassword, user.getPassword())) {
            throw new NotMatchPasswordException();
        }

        return UsernamePasswordAuthenticationToken.authenticated(MyLoginUser.from(user), null, List.of());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }

    public static class NotExistEmailException extends AuthenticationException {
        public NotExistEmailException() {
            super("not exist email");
        }
    }

    public static class NotMatchPasswordException extends AuthenticationException {
        public NotMatchPasswordException() {
            super("not match password");
        }
    }
}
