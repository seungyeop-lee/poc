package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.create;

public interface CreatePath {
    String CREATE = "/create";

    String getCreateView();

    String getAfterCreateView(Long id);
}
