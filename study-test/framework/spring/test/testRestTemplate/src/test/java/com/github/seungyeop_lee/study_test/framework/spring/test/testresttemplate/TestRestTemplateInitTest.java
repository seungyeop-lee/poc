package com.github.seungyeop_lee.study_test.framework.spring.test.testresttemplate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.LocalHostUriTemplateHandler;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriTemplateHandler;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class TestRestTemplateInitTest {
    @Test
    void checkAutowired(@Autowired TestRestTemplate rest) {
        String rootUri = rest.getRootUri();
        assertThat(rootUri).isEqualTo("http://localhost:8080");

        UriTemplateHandler uriTemplateHandler = rest.getRestTemplate().getUriTemplateHandler();
        assertThat(uriTemplateHandler).isInstanceOf(LocalHostUriTemplateHandler.class);
    }

    @Test
    void checkNew() {
        TestRestTemplate rest = new TestRestTemplate();

        String rootUri = rest.getRootUri();
        assertThat(rootUri).isEqualTo("");

        UriTemplateHandler uriTemplateHandler = rest.getRestTemplate().getUriTemplateHandler();
        assertThat(uriTemplateHandler).isInstanceOf(DefaultUriBuilderFactory.class);
    }
}
