package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.create;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository.CreateRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CreateService<DomainType> extends BaseCreateService<DomainType> {
    @Transactional
    default DomainType create(DomainType domain) {
        return getCreateRepository().save(domain);
    }

    CreateRepository<DomainType> getCreateRepository();
}
