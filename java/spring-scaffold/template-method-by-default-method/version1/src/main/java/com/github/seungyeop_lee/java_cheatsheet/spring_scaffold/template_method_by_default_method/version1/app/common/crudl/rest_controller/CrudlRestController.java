package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.create.CreateRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.delete.DeleteRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.read.ReadRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.update.UpdateRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.BaseCrudlService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.create.BaseCreateService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.delete.BaseDeleteService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.list.BaseListService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.read.BaseReadService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.update.BaseUpdateService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.list.ListRestController;

public interface CrudlRestController<
        DomainType extends Updatable<UpdateDataType>,
        CreateInType, CreateOutType,
        ReadOutType,
        UpdateInType, UpdateDataType, UpdateOutType,
        DeleteOutType,
        ListInType, SearchInfoType, ListResultType, ListOutType> extends
        BaseCrudlRestController<CreateInType, CreateOutType, ReadOutType, UpdateInType, UpdateOutType, DeleteOutType, ListInType, ListOutType>,
        CreateRestController<DomainType, CreateInType, CreateOutType>,
        ReadRestController<DomainType, ReadOutType>,
        UpdateRestController<DomainType, UpdateDataType, UpdateInType, UpdateOutType>,
        DeleteRestController<DeleteOutType>,
        ListRestController<ListInType, SearchInfoType, ListResultType, ListOutType> {
    BaseCrudlService<DomainType, UpdateDataType, SearchInfoType, ListResultType> getCrudlService();

    @Override
    default BaseCreateService<DomainType> getCreateService() {
        return getCrudlService();
    }

    @Override
    default BaseDeleteService getDeleteService() {
        return getCrudlService();
    }

    @Override
    default BaseListService<SearchInfoType, ListResultType> getListService() {
        return getCrudlService();
    }

    @Override
    default BaseReadService<DomainType> getReadService() {
        return getCrudlService();
    }

    @Override
    default BaseUpdateService<DomainType, UpdateDataType> getUpdateService() {
        return getCrudlService();
    }
}
