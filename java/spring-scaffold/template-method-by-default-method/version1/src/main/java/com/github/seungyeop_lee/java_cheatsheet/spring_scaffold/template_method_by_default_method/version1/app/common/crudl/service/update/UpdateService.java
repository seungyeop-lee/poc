package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.update;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.UpdateRepository;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.Updatable;
import org.springframework.transaction.annotation.Transactional;

public interface UpdateService<DomainType extends Updatable<UpdateDataType>, UpdateDataType> extends BaseUpdateService<DomainType, UpdateDataType> {
    @Transactional
    default DomainType update(Long id, UpdateDataType updateInfo) {
        DomainType found = getUpdateRepository().findById(id).get();
        found.update(updateInfo);
        return found;
    }

    UpdateRepository<DomainType> getUpdateRepository();
}
