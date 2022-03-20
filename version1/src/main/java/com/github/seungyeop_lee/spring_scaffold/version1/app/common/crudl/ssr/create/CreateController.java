package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.IdGetter;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlConst;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

public interface CreateController<DomainType extends IdGetter, InObjectType> {
    @GetMapping(CreatePath.CREATE)
    default String createView(InObjectType param, Model model) {
        model.addAttribute(getCreateParamObjName(), param);

        return getCreatePath().getCreateView();
    }

    @PostMapping(CreatePath.CREATE)
    default String create(InObjectType param) {
        DomainType domain = getCreateDomainMapper().build(param);
        DomainType created = getCreateService().create(domain);

        return getCreatePath().getAfterCreateView(created.getId());
    }

    default String getCreateParamObjName() {
        return CrudlConst.ModelAttrName.CREATE_PARAM;
    }

    CreatePath getCreatePath();
    CreateService<DomainType> getCreateService();
    BaseMapper<InObjectType, DomainType> getCreateDomainMapper();
}
