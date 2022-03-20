package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read;

import java.util.Optional;

public interface ReadRepository<DomainType> {
    Optional<DomainType> findById(Long id);
}
