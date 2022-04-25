package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.create;

import org.springframework.transaction.annotation.Transactional;

public interface BaseCreateService<DomainType> {
    @Transactional
    DomainType create(DomainType domain);
}
