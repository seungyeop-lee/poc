package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.create.BaseCreateRestController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.delete.BaseDeleteRestController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.list.BaseListRestController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.read.BaseReadRestController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.update.BaseUpdateRestController;

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
