package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.rest_controller.update;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.update.BaseUpdateService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface UpdateRestController<DomainType extends Updatable<UpdateDataType>, UpdateDataType, InObjectType, OutObjectType> extends BaseUpdateRestController<InObjectType, OutObjectType> {
    @PutMapping(UpdateRestPath.UPDATE)
    default OutObjectType update(@PathVariable Long id, @RequestBody InObjectType param) {
        UpdateDataType updateData = this.getUpdateDataMapper().mapFrom(param);

        DomainType updated = getUpdateService().update(id, updateData);

        return getUpdateOutDataMapper().mapFrom(updated);
    }

    BaseMapper<InObjectType, UpdateDataType> getUpdateDataMapper();

    BaseUpdateService<DomainType, UpdateDataType> getUpdateService();

    BaseMapper<DomainType, OutObjectType> getUpdateOutDataMapper();
}
