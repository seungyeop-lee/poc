package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.BaseCreateService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.BaseDeleteService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.BaseListService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.BaseReadService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.BaseUpdateService;

public interface BaseCrudlService<DomainType extends Updatable<UpdateDataType>, UpdateDataType, SearchInfoType, ListResultType> extends
        BaseCreateService<DomainType>,
        BaseReadService<DomainType>,
        BaseUpdateService<DomainType, UpdateDataType>,
        BaseDeleteService,
        BaseListService<SearchInfoType, ListResultType> {
}
