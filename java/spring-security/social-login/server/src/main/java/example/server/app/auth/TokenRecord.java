package example.server.app.auth;

public record TokenRecord(
        String access,
        String refresh
) {
}
