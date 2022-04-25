package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository;

import java.util.Optional;

public interface ReadRepository<DomainType> {
    Optional<DomainType> findById(Long id);
}
