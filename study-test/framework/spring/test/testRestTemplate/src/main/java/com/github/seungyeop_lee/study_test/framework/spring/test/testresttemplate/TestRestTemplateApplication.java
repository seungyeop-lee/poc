package com.github.seungyeop_lee.study_test.framework.spring.test.testresttemplate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class TestRestTemplateApplication {

    public static void main(String[] args) {
        SpringApplication.run(TestRestTemplateApplication.class, args);
    }

    @RestController
    static class HelloController {
        @GetMapping("/hello")
        public String hello(String name) {
            if (name == null || name.trim().length() == 0) {
                throw new IllegalArgumentException();
            }
            return name;
        }
    }
}
