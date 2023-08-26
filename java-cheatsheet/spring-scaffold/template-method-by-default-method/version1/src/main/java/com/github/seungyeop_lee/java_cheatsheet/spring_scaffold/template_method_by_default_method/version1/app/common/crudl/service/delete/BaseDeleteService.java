package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.delete;

import org.springframework.transaction.annotation.Transactional;

public interface BaseDeleteService {
    @Transactional
    void delete(Long id);
}
