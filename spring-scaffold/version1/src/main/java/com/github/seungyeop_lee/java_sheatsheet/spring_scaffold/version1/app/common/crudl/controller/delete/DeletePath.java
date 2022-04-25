package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.delete;

public interface DeletePath {
    String DELETE = "/{id}/delete";

    String getAfterDeleteView();
}
