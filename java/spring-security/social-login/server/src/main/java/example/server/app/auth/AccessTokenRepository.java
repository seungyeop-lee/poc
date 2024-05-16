package example.server.app.auth;

public interface AccessTokenRepository {
    void save(String code, String token);

    String popToken(String code);
}
