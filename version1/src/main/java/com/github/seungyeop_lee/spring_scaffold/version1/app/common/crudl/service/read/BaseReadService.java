package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.read;

import org.springframework.transaction.annotation.Transactional;

public interface BaseReadService<DomainType> {
    @Transactional(readOnly = true)
    DomainType findById(Long id);
}
