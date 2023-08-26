package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.read;

public interface BaseReadRestController<OutObjectType> {
    OutObjectType readView(Long id);
}
