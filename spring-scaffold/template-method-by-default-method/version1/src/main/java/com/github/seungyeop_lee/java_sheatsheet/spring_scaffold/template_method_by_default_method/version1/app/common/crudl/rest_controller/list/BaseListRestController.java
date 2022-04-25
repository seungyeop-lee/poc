package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.list;

import org.springframework.data.domain.Pageable;

public interface BaseListRestController<InObjectType, OutObjectType> {
    OutObjectType listView(Pageable pageable, InObjectType param);
}
