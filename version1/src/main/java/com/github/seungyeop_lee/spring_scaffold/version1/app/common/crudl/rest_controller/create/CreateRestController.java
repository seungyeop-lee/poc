package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.rest_controller.create;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.create.BaseCreateService;
import org.springframework.web.bind.annotation.PostMapping;

public interface CreateRestController<DomainType, InObjectType, OutObjectType> extends BaseCreateRestController<InObjectType, OutObjectType> {
    @PostMapping(CreateRestPath.CREATE)
    default OutObjectType create(InObjectType param) {
        DomainType domain = getCreateDomainMapper().build(param);
        DomainType created = getCreateService().create(domain);

        return getCreateOutDataMapper().build(created);
    }

    BaseMapper<InObjectType, DomainType> getCreateDomainMapper();

    BaseCreateService<DomainType> getCreateService();

    BaseMapper<DomainType, OutObjectType> getCreateOutDataMapper();
}
