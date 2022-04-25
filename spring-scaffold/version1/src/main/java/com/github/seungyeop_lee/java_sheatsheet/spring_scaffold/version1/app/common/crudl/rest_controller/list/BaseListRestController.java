package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.list;

import org.springframework.data.domain.Pageable;

public interface BaseListRestController<InObjectType, OutObjectType> {
    OutObjectType listView(Pageable pageable, InObjectType param);
}
