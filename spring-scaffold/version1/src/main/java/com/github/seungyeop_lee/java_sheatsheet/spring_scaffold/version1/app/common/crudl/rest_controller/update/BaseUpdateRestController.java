package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.update;

public interface BaseUpdateRestController<InObjectType, OutObjectType> {
    OutObjectType update(Long id, InObjectType param);
}
