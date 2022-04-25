package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository;

import java.util.Optional;

public interface ReadRepository<DomainType> {
    Optional<DomainType> findById(Long id);
}
