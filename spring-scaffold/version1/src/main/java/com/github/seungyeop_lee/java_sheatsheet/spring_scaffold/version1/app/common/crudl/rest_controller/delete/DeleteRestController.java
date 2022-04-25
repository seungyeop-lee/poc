package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.delete;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.delete.BaseDeleteService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface DeleteRestController<OutObjectType> extends BaseDeleteRestController<OutObjectType> {
    @DeleteMapping(DeleteRestPath.DELETE)
    default OutObjectType delete(@PathVariable Long id) {
        getDeleteService().delete(id);

        return getOutObject();
    }

    BaseDeleteService getDeleteService();

    OutObjectType getOutObject();
}
