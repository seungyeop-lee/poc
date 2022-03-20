package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.repository;

public interface CrudRepository<DomainType> extends CreateRepository<DomainType>, ReadRepository<DomainType>, UpdateRepository<DomainType>, DeleteRepository {
}
