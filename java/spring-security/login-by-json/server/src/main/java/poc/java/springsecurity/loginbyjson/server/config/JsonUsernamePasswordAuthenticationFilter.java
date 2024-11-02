package poc.java.springsecurity.loginbyjson.server.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected String obtainUsername(HttpServletRequest request) {
        return getValue(request, this.getUsernameParameter());
    }

    @Override
    protected String obtainPassword(HttpServletRequest request) {
        return getValue(request, this.getPasswordParameter());
    }

    private String getValue(HttpServletRequest request, String key) {
        Object savedBodyNode = request.getAttribute("bodyNode");
        if (savedBodyNode != null) {
            JsonNode savedKeyNode = ((JsonNode) savedBodyNode).get(key);
            return savedKeyNode == null ? null : savedKeyNode.asText();
        }

        try {
            JsonNode bodyNode = objectMapper.readTree(StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8));
            request.setAttribute("bodyNode", bodyNode);
            JsonNode keyNode = bodyNode.get(key);
            return keyNode == null ? null : keyNode.asText();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
