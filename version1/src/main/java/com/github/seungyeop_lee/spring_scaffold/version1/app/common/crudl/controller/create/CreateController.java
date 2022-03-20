package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.create;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.IdGetter;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.common.ControllerConst;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.create.BaseCreateService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

public interface CreateController<DomainType extends IdGetter, InObjectType> extends BaseCreateController<InObjectType> {
    @GetMapping(CreatePath.CREATE)
    default String createView(InObjectType param, Model model) {
        model.addAttribute(getCreateParamObjName(), param);

        return getCreatePath().getCreateView();
    }

    @PostMapping(CreatePath.CREATE)
    default String create(InObjectType param) {
        DomainType domain = getCreateDomainMapper().mapFrom(param);
        DomainType created = getCreateService().create(domain);

        return getCreatePath().getAfterCreateView(created.getId());
    }

    default String getCreateParamObjName() {
        return ControllerConst.ModelAttrName.CREATE_PARAM;
    }

    CreatePath getCreatePath();

    BaseCreateService<DomainType> getCreateService();

    BaseMapper<InObjectType, DomainType> getCreateDomainMapper();
}
