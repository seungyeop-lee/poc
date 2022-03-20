package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreateRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreateService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeleteRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeleteService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdateRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdateService;

public interface CrudlService<DomainType extends Updatable<UpdateDataType>, UpdateDataType, SearchInfoType, ListResultType> extends
        BaseCrudlService<DomainType, UpdateDataType, SearchInfoType, ListResultType>,
        CreateService<DomainType>,
        ReadService<DomainType>,
        UpdateService<DomainType, UpdateDataType>,
        DeleteService,
        ListService<SearchInfoType, ListResultType> {
    CrudRepository<DomainType> getCrudRepository();

    @Override
    default CreateRepository<DomainType> getCreateRepository() {
        return getCrudRepository();
    }

    @Override
    default DeleteRepository getDeleteRepository() {
        return getCrudRepository();
    }

    @Override
    default ReadRepository<DomainType> getReadRepository() {
        return getCrudRepository();
    }

    @Override
    default UpdateRepository<DomainType> getUpdateRepository() {
        return getCrudRepository();
    }
}
