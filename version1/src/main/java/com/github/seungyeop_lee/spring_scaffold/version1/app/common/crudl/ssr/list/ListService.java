package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface ListService<SearchInfoType, ListResultType> {
    @Transactional(readOnly = true)
    default Page<ListResultType> list(SearchInfoType searchInfo, Pageable pageable) {
        return getListRepository().list(searchInfo, pageable);
    }

    ListRepository<SearchInfoType ,ListResultType> getListRepository();
}
