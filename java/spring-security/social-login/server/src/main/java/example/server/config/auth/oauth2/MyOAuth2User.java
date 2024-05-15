package example.server.config.auth.oauth2;

import example.server.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class MyOAuth2User implements OAuth2User {

    private String name;
    private String username;

    public static MyOAuth2User of(
            String name,
            String username
    ) {
        MyOAuth2User user = new MyOAuth2User();
        user.name = name;
        user.username = username;
        return user;
    }

    public static MyOAuth2User from(User user) {
        return MyOAuth2User.of(
                user.getName(),
                user.getProvider() + ":" + user.getProviderUserId()
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

    public String getUsername() {
        return this.username;
    }
}
