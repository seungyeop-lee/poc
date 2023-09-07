package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.read;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.read.BaseReadService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.common.ControllerConst;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface ReadController<DomainType, ViewDataType> extends BaseReadController {
    @GetMapping(ReadPath.READ)
    default String readView(@PathVariable Long id, Model model) {
        DomainType found = getReadService().findById(id);

        model.addAttribute(getReadResultObjName(), getReadViewDataMapper().mapFrom(found));
        model.addAttribute("id", id);

        return getReadPath().getReadView();
    }

    default String getReadResultObjName() {
        return ControllerConst.ModelAttrName.READ_RESULT;
    }

    ReadPath getReadPath();

    BaseReadService<DomainType> getReadService();

    BaseMapper<DomainType, ViewDataType> getReadViewDataMapper();
}
