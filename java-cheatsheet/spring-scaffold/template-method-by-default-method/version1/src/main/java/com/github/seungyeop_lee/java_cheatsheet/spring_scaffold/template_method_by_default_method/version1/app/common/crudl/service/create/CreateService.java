package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.create;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.CreateRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CreateService<DomainType> extends BaseCreateService<DomainType> {
    @Transactional
    default DomainType create(DomainType domain) {
        return getCreateRepository().save(domain);
    }

    CreateRepository<DomainType> getCreateRepository();
}
