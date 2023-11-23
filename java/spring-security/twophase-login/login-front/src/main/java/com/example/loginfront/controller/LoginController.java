package com.example.loginfront.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
public class LoginController {

    @GetMapping("/member/login")
    public String login() {
        return "login";
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

    @PostMapping("/member/login-confirm")
    public String loginConfirm(
            @RequestParam String id,
            Model model
    ) {
        log.info("login id: {}", id);
        model.addAttribute("id", id);
        return "login-confirm";
    }
}
