package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.update;

public interface UpdatePath {
    String UPDATE = "/{id}/update";

    String getUpdateView();

    String getAfterUpdateView(Long id);
}
