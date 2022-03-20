package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.update;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.common.ControllerConst;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.update.BaseUpdateService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface UpdateController<DomainType extends Updatable<UpdateDataType>, UpdateDataType, InObjectType, ViewDataType> extends BaseUpdateController<InObjectType> {
    @GetMapping(UpdatePath.UPDATE)
    default String updateView(@PathVariable Long id, Model model) {
        DomainType found = getUpdateService().findById(id);

        model.addAttribute(getUpdateParamObjName(), getUpdateViewDataMapper().build(found));

        return getUpdatePath().getUpdateView();
    }

    @PostMapping(UpdatePath.UPDATE)
    default String update(@PathVariable Long id, InObjectType param) {
        UpdateDataType updateData = getUpdateDomainMapper().build(param);
        getUpdateService().update(id, updateData);

        return getUpdatePath().getAfterUpdateView(id);
    }

    default String getUpdateParamObjName() {
        return ControllerConst.ModelAttrName.UPDATE_PARAM;
    }

    UpdatePath getUpdatePath();

    BaseUpdateService<DomainType, UpdateDataType> getUpdateService();

    BaseMapper<DomainType, ViewDataType> getUpdateViewDataMapper();

    BaseMapper<InObjectType, UpdateDataType> getUpdateDomainMapper();
}
