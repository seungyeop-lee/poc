package com.seungyeoplee.poc.communication.grpcsimple.javaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class JavaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaServerApplication.class, args);
    }

    @RestController
    public static class HelloController {
        @GetMapping("/hello")
        public String hello() {
            return "Hello, Java Server!";
        }
    }
}
