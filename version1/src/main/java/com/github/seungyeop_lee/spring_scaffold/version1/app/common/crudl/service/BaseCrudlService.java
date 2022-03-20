package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.create.BaseCreateService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.delete.BaseDeleteService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.list.BaseListService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.read.BaseReadService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.update.BaseUpdateService;

public interface BaseCrudlService<DomainType extends Updatable<UpdateDataType>, UpdateDataType, SearchInfoType, ListResultType> extends
        BaseCreateService<DomainType>,
        BaseReadService<DomainType>,
        BaseUpdateService<DomainType, UpdateDataType>,
        BaseDeleteService,
        BaseListService<SearchInfoType, ListResultType> {
}
