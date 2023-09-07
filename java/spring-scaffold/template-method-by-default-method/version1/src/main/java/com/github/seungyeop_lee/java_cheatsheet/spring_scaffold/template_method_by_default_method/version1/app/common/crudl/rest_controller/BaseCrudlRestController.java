package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.create.BaseCreateRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.delete.BaseDeleteRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.read.BaseReadRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.update.BaseUpdateRestController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.list.BaseListRestController;

public interface BaseCrudlRestController<
        CreateInType, CreateOutType,
        ReadOutType,
        UpdateInType, UpdateOutType,
        DeleteOutType,
        ListInType, ListOutType> extends
        BaseCreateRestController<CreateInType, CreateOutType>,
        BaseReadRestController<ReadOutType>,
        BaseUpdateRestController<UpdateInType, UpdateOutType>,
        BaseDeleteRestController<DeleteOutType>,
        BaseListRestController<ListInType, ListOutType> {
}
