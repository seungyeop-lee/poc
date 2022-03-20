package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.create;

public interface CreatePath {
    String CREATE = "/create";

    String getCreateView();

    String getAfterCreateView(Long id);
}
