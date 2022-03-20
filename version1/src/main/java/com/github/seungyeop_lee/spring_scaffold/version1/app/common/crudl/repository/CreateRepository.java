package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.repository;

public interface CreateRepository<DomainType> {
    DomainType save(DomainType domain);
}
