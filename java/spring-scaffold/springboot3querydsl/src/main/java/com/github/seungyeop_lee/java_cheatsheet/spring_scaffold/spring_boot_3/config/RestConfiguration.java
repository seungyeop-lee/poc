package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.RepositoryDetectionStrategy.RepositoryDetectionStrategies;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
@RequiredArgsConstructor
public class RestConfiguration implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // response body에 id 추가
        Class[] classes = entityManager.getMetamodel()
                .getEntities()
                .stream()
                .map(Type::getJavaType)
                .toArray(Class[]::new);
        config.exposeIdsFor(classes);

        // Request Header의 Accept에 따라 response가 달라지도록 변경
        // application/hal+json or application/json
        config.useHalAsDefaultJsonMediaType(false);

        // @(Repository)RestResource 어노테이션이 붙어있는 것 Spring Data REST로 노출
        config.setRepositoryDetectionStrategy(RepositoryDetectionStrategies.ANNOTATED);
    }
}
