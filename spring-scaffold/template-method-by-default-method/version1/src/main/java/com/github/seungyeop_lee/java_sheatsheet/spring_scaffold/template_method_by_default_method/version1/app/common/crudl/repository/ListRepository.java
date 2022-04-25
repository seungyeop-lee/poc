package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListRepository<SearchInfoType, ListResultType> {
    Page<ListResultType> list(SearchInfoType searchInfo, Pageable pageable);
}
