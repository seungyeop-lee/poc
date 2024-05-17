package example.server.app.auth;

public interface AccessTokenRepository {
    void save(String code, TokenRecord token);

    TokenRecord getToken(String code);
}
