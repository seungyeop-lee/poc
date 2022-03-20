package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete;

import org.springframework.transaction.annotation.Transactional;

public interface BaseDeleteService {
    @Transactional
    void delete(Long id);
}
