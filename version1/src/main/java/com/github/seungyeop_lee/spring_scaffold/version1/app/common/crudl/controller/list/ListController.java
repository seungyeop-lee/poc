package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.list;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.common.ControllerConst;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.list.BaseListService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public interface ListController<InObjectType, SearchInfo, ListResultType, ViewDataType> extends BaseListController<InObjectType> {
    @GetMapping(ListPath.LIST)
    default String listView(
            Pageable pageable,
            InObjectType param,
            Model model) {
        SearchInfo searchInfo = getSearchInfoMapper().mapFrom(param);

        Page<ListResultType> listResult = getListService().list(searchInfo, pageable);

        ViewDataType outObject = getListViewDataMapper().mapFrom(listResult);
        model.addAttribute(getListObjName(), outObject);

        return getListPath().getListView();
    }

    default String getListObjName() {
        return ControllerConst.ModelAttrName.LIST_RESULT;
    }

    ListPath getListPath();

    BaseMapper<InObjectType, SearchInfo> getSearchInfoMapper();

    BaseListService<SearchInfo, ListResultType> getListService();

    BaseMapper<Page<ListResultType>, ViewDataType> getListViewDataMapper();
}
