package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.update;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.service.read.BaseReadService;
import org.springframework.transaction.annotation.Transactional;

public interface BaseUpdateService<DomainType extends Updatable<UpdateDataType>, UpdateDataType> extends BaseReadService<DomainType> {
    @Transactional
    DomainType update(Long id, UpdateDataType updateInfo);
}
