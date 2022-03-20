package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update;

import java.util.Optional;

public interface UpdateRepository<DomainType> {
    Optional<DomainType> findById(Long id);
}
