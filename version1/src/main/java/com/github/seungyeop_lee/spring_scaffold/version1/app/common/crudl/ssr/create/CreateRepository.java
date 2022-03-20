package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create;

public interface CreateRepository<DomainType> {
    DomainType save(DomainType domain);
}
