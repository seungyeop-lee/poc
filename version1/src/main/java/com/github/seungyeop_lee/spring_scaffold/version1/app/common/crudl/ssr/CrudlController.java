package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.IdGetter;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreateController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreatePath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreateService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeleteController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeletePath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeleteService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListPath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadPath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdateController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdatePath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdateService;

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
        CreateController<DomainType, CreateInType>,
        ReadController<DomainType, ReadViewDataType>,
        UpdateController<DomainType, UpdateDataType, UpdateInType, UpdateViewDataType>,
        DeleteController,
        ListController<ListInType, SearchInfoType, ListResultType, ListViewDataType>
{
    CrudlPath getCrudlPath();
    CrudlService<DomainType, UpdateDataType, SearchInfoType, ListResultType> getCrudlService();

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
    default CreateService<DomainType> getCreateService() {
        return getCrudlService();
    }

    @Override
    default DeleteService getDeleteService(){
        return getCrudlService();
    }

    @Override
    default ListService<SearchInfoType, ListResultType> getListService(){
        return getCrudlService();
    }

    @Override
    default ReadService<DomainType> getReadService(){
        return getCrudlService();
    }

    @Override
    default UpdateService<DomainType, UpdateDataType> getUpdateService(){
        return getCrudlService();
    }
}
