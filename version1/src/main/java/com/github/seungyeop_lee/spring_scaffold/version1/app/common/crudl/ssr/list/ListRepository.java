package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListRepository<SearchInfoType ,ListResultType> {
    Page<ListResultType> list(SearchInfoType searchInfo, Pageable pageable);
}
