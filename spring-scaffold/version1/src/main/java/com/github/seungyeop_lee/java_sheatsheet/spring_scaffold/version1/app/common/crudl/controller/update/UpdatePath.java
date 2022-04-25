package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.update;

public interface UpdatePath {
    String UPDATE = "/{id}/update";

    String getUpdateView();

    String getAfterUpdateView(Long id);
}
