package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create.CreateRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.delete.DeleteRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.ReadRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update.UpdateRepository;

public interface CrudRepository<DomainType> extends CreateRepository<DomainType>, ReadRepository<DomainType>, UpdateRepository<DomainType>, DeleteRepository {
}
