package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.delete;

import org.springframework.transaction.annotation.Transactional;

public interface BaseDeleteService {
    @Transactional
    void delete(Long id);
}
