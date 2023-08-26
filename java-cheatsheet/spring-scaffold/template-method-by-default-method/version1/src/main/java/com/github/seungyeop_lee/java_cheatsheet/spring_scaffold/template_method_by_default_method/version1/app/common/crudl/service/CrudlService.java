package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.*;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.create.CreateService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.delete.DeleteService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.list.ListService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.read.ReadService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.update.UpdateService;

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
