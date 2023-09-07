package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository;

public interface CrudRepository<DomainType> extends CreateRepository<DomainType>, ReadRepository<DomainType>, UpdateRepository<DomainType>, DeleteRepository {
}
