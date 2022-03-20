package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadService;
import org.springframework.transaction.annotation.Transactional;

public interface UpdateService<DomainType extends Updatable<UpdateDataType>, UpdateDataType> extends ReadService<DomainType> {
    @Transactional
    default void update(Long id, UpdateDataType updateInfo) {
        DomainType found = getUpdateRepository().findById(id).get();
        found.update(updateInfo);
    }

    UpdateRepository<DomainType> getUpdateRepository();
}
