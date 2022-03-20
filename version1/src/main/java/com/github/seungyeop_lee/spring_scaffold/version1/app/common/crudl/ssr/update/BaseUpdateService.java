package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.Updatable;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read.BaseReadService;
import org.springframework.transaction.annotation.Transactional;

public interface BaseUpdateService<DomainType extends Updatable<UpdateDataType>, UpdateDataType> extends BaseReadService<DomainType> {
    @Transactional
    void update(Long id, UpdateDataType updateInfo);
}
