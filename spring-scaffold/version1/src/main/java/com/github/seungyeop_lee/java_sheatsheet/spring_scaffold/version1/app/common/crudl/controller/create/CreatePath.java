package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.controller.create;

public interface CreatePath {
    String CREATE = "/create";

    String getCreateView();

    String getAfterCreateView(Long id);
}
