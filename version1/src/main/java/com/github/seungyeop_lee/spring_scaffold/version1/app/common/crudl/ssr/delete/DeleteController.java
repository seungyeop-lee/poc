package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface DeleteController extends BaseDeleteController {
    @PostMapping(DeletePath.DELETE)
    default String delete(@PathVariable Long id) {
        getDeleteService().delete(id);

        return getDeletePath().getAfterDeleteView();
    }

    DeletePath getDeletePath();

    BaseDeleteService getDeleteService();
}
