package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.rest_controller.list;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.list.BaseListService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;

public interface ListRestController<InObjectType, SearchInfo, ListResultType, OutObjectType> extends BaseListRestController<InObjectType, OutObjectType> {
    @GetMapping(ListRestPath.LIST)
    default OutObjectType listView(Pageable pageable, InObjectType param) {
        SearchInfo searchInfo = getSearchInfoMapper().build(param);

        Page<ListResultType> listResult = getListService().list(searchInfo, pageable);

        OutObjectType outObject = getListOutDataMapper().build(listResult);

        return outObject;
    }

    BaseMapper<InObjectType, SearchInfo> getSearchInfoMapper();

    BaseListService<SearchInfo, ListResultType> getListService();

    BaseMapper<Page<ListResultType>, OutObjectType> getListOutDataMapper();
}
