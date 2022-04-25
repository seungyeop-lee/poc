package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.list.ListPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.read.ReadPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.create.CreatePath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.delete.DeletePath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.update.UpdatePath;

public interface CrudlPath extends CreatePath, ReadPath, UpdatePath, DeletePath, ListPath {
    CrudlViewPath getViewPath();

    @Override
    default String getCreateView() {
        return getViewPath().getCreate();
    }

    @Override
    default String getAfterCreateView(Long id) {
        return getViewPath().getAfterCreate(id);
    }

    @Override
    default String getAfterDeleteView() {
        return getViewPath().getAfterDelete();
    }

    @Override
    default String getListView() {
        return getViewPath().getList();
    }

    @Override
    default String getReadView() {
        return getViewPath().getRead();
    }

    @Override
    default String getUpdateView() {
        return getViewPath().getUpdate();
    }

    @Override
    default String getAfterUpdateView(Long id) {
        return getViewPath().getAfterUpdate(id);
    }
}
