package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.delete;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository.DeleteRepository;
import org.springframework.transaction.annotation.Transactional;

public interface DeleteService extends BaseDeleteService {
    @Transactional
    default void delete(Long id) {
        getDeleteRepository().deleteById(id);
    }

    DeleteRepository getDeleteRepository();
}
