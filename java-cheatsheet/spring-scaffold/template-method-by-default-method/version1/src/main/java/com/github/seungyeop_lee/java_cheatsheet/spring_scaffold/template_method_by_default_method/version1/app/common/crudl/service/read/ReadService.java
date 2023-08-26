package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.read;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.ReadRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ReadService<DomainType> extends BaseReadService<DomainType> {
    @Transactional(readOnly = true)
    default DomainType findById(Long id) {
        return getReadRepository().findById(id).get();
    }

    ReadRepository<DomainType> getReadRepository();
}
