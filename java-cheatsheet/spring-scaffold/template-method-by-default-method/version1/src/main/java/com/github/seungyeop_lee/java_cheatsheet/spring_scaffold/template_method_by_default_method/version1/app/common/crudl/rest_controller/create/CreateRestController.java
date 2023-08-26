package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.create;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.create.BaseCreateService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface CreateRestController<DomainType, InObjectType, OutObjectType> extends BaseCreateRestController<InObjectType, OutObjectType> {
    @PostMapping(CreateRestPath.CREATE)
    default OutObjectType create(@RequestBody InObjectType param) {
        DomainType domain = getCreateDomainMapper().mapFrom(param);
        DomainType created = getCreateService().create(domain);

        return getCreateOutDataMapper().mapFrom(created);
    }

    BaseMapper<InObjectType, DomainType> getCreateDomainMapper();

    BaseCreateService<DomainType> getCreateService();

    BaseMapper<DomainType, OutObjectType> getCreateOutDataMapper();
}
