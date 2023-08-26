package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.list;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface BaseListService<SearchInfoType, ListResultType> {
    @Transactional(readOnly = true)
    Page<ListResultType> list(SearchInfoType searchInfo, Pageable pageable);
}
