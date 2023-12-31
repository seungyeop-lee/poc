package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.delete;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.DeleteRepository;
import org.springframework.transaction.annotation.Transactional;

public interface DeleteService extends BaseDeleteService {
    @Transactional
    default void delete(Long id) {
        getDeleteRepository().deleteById(id);
    }

    DeleteRepository getDeleteRepository();
}
