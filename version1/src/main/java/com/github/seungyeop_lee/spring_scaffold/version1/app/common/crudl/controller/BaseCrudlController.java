package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.create.BaseCreateController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.delete.BaseDeleteController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.list.BaseListController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.read.BaseReadController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.update.BaseUpdateController;

public interface BaseCrudlController<CreateInType, UpdateInType, ListInType> extends
        BaseCreateController<CreateInType>,
        BaseReadController,
        BaseUpdateController<UpdateInType>,
        BaseDeleteController,
        BaseListController<ListInType> {
}
