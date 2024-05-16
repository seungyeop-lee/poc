package example.server.config.auth.model;

import example.server.helper.jwt.JWTBuilder;
import example.server.helper.jwt.JWTReader;
import example.server.model.User;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@ToString
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

    public static MyOAuth2User from(JWTReader jwtReader) {
        return MyOAuth2User.of(
                jwtReader.getClaim("uid"),
                jwtReader.getClaim("provider"),
                jwtReader.getClaim("name"),
                jwtReader.getClaim("email")
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

    public String toAccessToken(JWTBuilder jwtBuilder) {
        return jwtBuilder
                .withClaim("uid", this.uid)
                .withClaim("provider", this.provider)
                .withClaim("name", this.name)
                .withClaim("email", this.email)
                .build();
    }
}
