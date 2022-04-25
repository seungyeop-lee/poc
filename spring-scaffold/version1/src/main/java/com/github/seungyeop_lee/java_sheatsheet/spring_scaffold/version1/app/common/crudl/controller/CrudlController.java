package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.list.ListController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.list.ListPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.read.ReadController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.read.ReadPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.base.IdGetter;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.create.CreateController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.create.CreatePath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.delete.DeleteController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.delete.DeletePath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.update.UpdateController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.update.UpdatePath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.BaseCrudlService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.create.BaseCreateService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.delete.BaseDeleteService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.list.BaseListService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.read.BaseReadService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.update.BaseUpdateService;

public interface CrudlController<
        DomainType extends Updatable<UpdateDataType> & IdGetter,
        CreateInType,
        ReadViewDataType,
        UpdateInType,
        UpdateDataType,
        UpdateViewDataType,
        ListInType,
        SearchInfoType,
        ListResultType,
        ListViewDataType
        > extends
        BaseCrudlController<CreateInType, UpdateInType, ListInType>,
        CreateController<DomainType, CreateInType>,
        ReadController<DomainType, ReadViewDataType>,
        UpdateController<DomainType, UpdateDataType, UpdateInType, UpdateViewDataType>,
        DeleteController,
        ListController<ListInType, SearchInfoType, ListResultType, ListViewDataType> {
    CrudlPath getCrudlPath();

    BaseCrudlService<DomainType, UpdateDataType, SearchInfoType, ListResultType> getCrudlService();

    @Override
    default CreatePath getCreatePath() {
        return getCrudlPath();
    }

    @Override
    default DeletePath getDeletePath() {
        return getCrudlPath();
    }

    @Override
    default ListPath getListPath() {
        return getCrudlPath();
    }

    @Override
    default ReadPath getReadPath() {
        return getCrudlPath();
    }

    @Override
    default UpdatePath getUpdatePath() {
        return getCrudlPath();
    }

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
