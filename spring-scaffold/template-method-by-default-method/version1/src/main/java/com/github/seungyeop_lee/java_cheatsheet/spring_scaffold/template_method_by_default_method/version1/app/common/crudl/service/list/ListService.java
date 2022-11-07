package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.list;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.ListRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface ListService<SearchInfoType, ListResultType> extends BaseListService<SearchInfoType, ListResultType> {
    @Transactional(readOnly = true)
    default Page<ListResultType> list(SearchInfoType searchInfo, Pageable pageable) {
        return getListRepository().list(searchInfo, pageable);
    }

    ListRepository<SearchInfoType, ListResultType> getListRepository();
}
