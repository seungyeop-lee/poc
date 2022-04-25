package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.create;

public interface BaseCreateRestController<InObjectType, OutObjectType> {
    OutObjectType create(InObjectType param);
}
