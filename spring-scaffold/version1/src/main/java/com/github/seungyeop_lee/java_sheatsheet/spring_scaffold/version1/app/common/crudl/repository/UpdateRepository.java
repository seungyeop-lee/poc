package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository;

import java.util.Optional;

public interface UpdateRepository<DomainType> {
    Optional<DomainType> findById(Long id);
}
