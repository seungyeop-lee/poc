package example.server.config.auth.oauth2;

import example.server.config.auth.jwt.JWTUtil;
import example.server.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class MyOAuth2User implements OAuth2User {

    private String uid;
    private String provider;
    private String name;
    private String email;

    public static MyOAuth2User of(
            String uid,
            String provider,
            String name,
            String email
    ) {
        MyOAuth2User user = new MyOAuth2User();
        user.uid = uid;
        user.provider = provider;
        user.name = name;
        user.email = email;
        return user;
    }

    public static MyOAuth2User from(User user) {
        return MyOAuth2User.of(
                user.getUid(),
                user.getProvider(),
                user.getName(),
                user.getEmail()
        );
    }

    public static MyOAuth2User from(String token, JWTUtil jwtUtil) {
        return MyOAuth2User.of(
                jwtUtil.getUid(token),
                jwtUtil.getProvider(token),
                jwtUtil.getName(token),
                jwtUtil.getEmail(token)
        );
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return this.name;
    }

    public JWTUtil.UserInfo toUserInfo() {
        return new JWTUtil.UserInfo(this.uid, this.provider, this.name, this.email);
    }
}
