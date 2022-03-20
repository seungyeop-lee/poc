package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.BaseCreateController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.BaseDeleteController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.BaseListController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.BaseReadController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.BaseUpdateController;

public interface BaseCrudlController<CreateInType, UpdateInType, ListInType> extends
        BaseCreateController<CreateInType>,
        BaseReadController,
        BaseUpdateController<UpdateInType>,
        BaseDeleteController,
        BaseListController<ListInType> {
}
