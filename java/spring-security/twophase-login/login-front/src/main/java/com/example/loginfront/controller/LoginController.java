package com.example.loginfront.controller;

import com.example.loginfront.service.LoginForwardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class LoginController {

    private final LoginForwardService loginForwardService;

    @GetMapping("/member/login")
    public String login() {
        return "login";
    }

    @PostMapping("/member/login/request")
    @ResponseBody
    public ResponseEntity<?> loginRequest(@RequestParam("id") String id) {
        log.info("id: {}", id);
        String uuid = loginForwardService.requestLogin(id);
        return ResponseEntity.ok(Map.of("uuid", uuid));
    }

    @GetMapping("/member/login-fail")
    public String loginFail() {
        return "login-fail";
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/main";
    }

    @GetMapping("/main")
    public String main() {
        return "main";
    }
}
