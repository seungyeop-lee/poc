package poc.java.springsecurity.loginbyjson.server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.stream.Collectors;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    protected String obtainUsername(HttpServletRequest request) {
        return getValue(request, this.getUsernameParameter());
    }

    protected String obtainPassword(HttpServletRequest request) {
        return getValue(request, this.getPasswordParameter());
    }

    private String getValue(HttpServletRequest request, String key) {
        try {
            String body = new HttpServletRequestWrapper(request)
                    .getReader()
                    .lines()
                    .collect(Collectors.joining());
            return objectMapper.readTree(body).get(key).asText();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
