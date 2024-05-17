package example.server.config.auth.common;

import example.server.helper.jwt.JWTBuilder;
import example.server.helper.jwt.JWTReader;
import example.server.model.LocalUser;
import example.server.model.SocialUser;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@ToString
public class MyLoginUser implements OAuth2User {

    private String uid;
    private String provider;
    private String name;
    private String email;

    public static MyLoginUser of(
            String uid,
            String provider,
            String name,
            String email
    ) {
        MyLoginUser user = new MyLoginUser();
        user.uid = uid;
        user.provider = provider;
        user.name = name;
        user.email = email;
        return user;
    }

    public static MyLoginUser from(SocialUser user) {
        return MyLoginUser.of(
                user.getUser().getUid(),
                user.getProvider(),
                user.getUser().getName(),
                user.getUser().getEmail()
        );
    }

    public static MyLoginUser from(LocalUser user) {
        return MyLoginUser.of(
                user.getUser().getUid(),
                user.getProvider(),
                user.getUser().getName(),
                user.getUser().getEmail()
        );
    }

    public static MyLoginUser from(JWTReader jwtReader) {
        return MyLoginUser.of(
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
                .withClaim("category", "access")
                .withClaim("uid", this.uid)
                .withClaim("provider", this.provider)
                .withClaim("name", this.name)
                .withClaim("email", this.email)
                .build();
    }

    public String toRefreshToken(JWTBuilder jwtBuilder) {
        return jwtBuilder
                .withClaim("category", "refresh")
                .withClaim("uid", this.uid)
                .withClaim("provider", this.provider)
                .withClaim("name", this.name)
                .withClaim("email", this.email)
                .build();
    }
}
