package com.example.loginback.login;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService service;

    @PostMapping("/login/request")
    public ResponseEntity<?> requestLogin(@RequestBody Map<String, String> body) {
        log.debug("body: {}", body);
        String uuid = service.request(body.get("id"));
        return ResponseEntity.ok(Map.of("uuid", uuid));
    }

    @PostMapping("/login/approve/{uuid}")
    public ResponseEntity<?> approveLogin(@PathVariable("uuid") String uuid) {
        log.debug("uuid: {}", uuid);
        service.approve(uuid);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login/confirm")
    public ResponseEntity<?> confirmLogin(@RequestBody Map<String, String> body) {
        log.debug("body: {}", body);
        boolean approval = service.confirm(body.get("uuid"));
        if (approval) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
}
