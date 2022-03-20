package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlConst;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public interface ListController<InObjectType, SearchInfo, ListResultType, ViewDataType> {
    @GetMapping(ListPath.LIST)
    default String listView(
            Pageable pageable,
            InObjectType param,
            Model model) {
        SearchInfo searchInfo = getSearchInfoMapper().build(param);

        Page<ListResultType> listResult = getListService().list(searchInfo, pageable);

        ViewDataType outObject = getListViewDataMapper().build(listResult);
        model.addAttribute(getListObjName(), outObject);

        return getListPath().getListView();
    }

    default String getListObjName() {
        return CrudlConst.ModelAttrName.LIST_RESULT;
    }

    ListPath getListPath();
    BaseMapper<InObjectType, SearchInfo> getSearchInfoMapper();

    ListService<SearchInfo, ListResultType> getListService();

    BaseMapper<Page<ListResultType>, ViewDataType> getListViewDataMapper();
}
