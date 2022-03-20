package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create;

import org.springframework.transaction.annotation.Transactional;

public interface CreateService<DomainType> extends BaseCreateService<DomainType> {
    @Transactional
    default DomainType create(DomainType domain) {
        return getCreateRepository().save(domain);
    }

    CreateRepository<DomainType> getCreateRepository();
}
