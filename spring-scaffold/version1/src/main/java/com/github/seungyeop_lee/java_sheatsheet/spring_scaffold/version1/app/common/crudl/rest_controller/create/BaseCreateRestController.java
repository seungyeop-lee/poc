package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.create;

public interface BaseCreateRestController<InObjectType, OutObjectType> {
    OutObjectType create(InObjectType param);
}
