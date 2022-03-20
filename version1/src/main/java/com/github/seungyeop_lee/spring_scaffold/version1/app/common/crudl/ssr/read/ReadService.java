package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read;

import org.springframework.transaction.annotation.Transactional;

public interface ReadService<DomainType> extends BaseReadService<DomainType> {
    @Transactional(readOnly = true)
    default DomainType findById(Long id) {
        return getReadRepository().findById(id).get();
    }

    ReadRepository<DomainType> getReadRepository();
}
