package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.read;

import org.springframework.transaction.annotation.Transactional;

public interface BaseReadService<DomainType> {
    @Transactional(readOnly = true)
    DomainType findById(Long id);
}
