package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.list.BaseListController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.read.BaseReadController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.create.BaseCreateController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.delete.BaseDeleteController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.update.BaseUpdateController;

public interface BaseCrudlController<CreateInType, UpdateInType, ListInType> extends
        BaseCreateController<CreateInType>,
        BaseReadController,
        BaseUpdateController<UpdateInType>,
        BaseDeleteController,
        BaseListController<ListInType> {
}
