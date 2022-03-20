package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.delete;

public interface DeletePath {
    String DELETE = "/{id}/delete";

    String getAfterDeleteView();
}
