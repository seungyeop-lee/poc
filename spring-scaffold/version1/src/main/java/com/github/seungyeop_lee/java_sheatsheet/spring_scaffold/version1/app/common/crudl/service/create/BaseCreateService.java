package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.create;

import org.springframework.transaction.annotation.Transactional;

public interface BaseCreateService<DomainType> {
    @Transactional
    DomainType create(DomainType domain);
}
