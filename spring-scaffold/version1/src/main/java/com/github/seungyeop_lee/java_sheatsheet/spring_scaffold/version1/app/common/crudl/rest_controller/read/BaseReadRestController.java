package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.read;

public interface BaseReadRestController<OutObjectType> {
    OutObjectType readView(Long id);
}
