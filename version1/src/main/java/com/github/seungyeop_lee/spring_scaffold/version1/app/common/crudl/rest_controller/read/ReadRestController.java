package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.rest_controller.read;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.read.BaseReadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface ReadRestController<DomainType, OutObjectType> extends BaseReadRestController<OutObjectType> {
    @GetMapping(ReadRestPath.READ)
    default OutObjectType readView(@PathVariable Long id) {
        DomainType found = getReadService().findById(id);

        return getReadOutDataMapper().mapFrom(found);
    }

    BaseReadService<DomainType> getReadService();

    BaseMapper<DomainType, OutObjectType> getReadOutDataMapper();
}
