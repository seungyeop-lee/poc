package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.update;

public interface UpdatePath {
    String UPDATE = "/{id}/update";

    String getUpdateView();

    String getAfterUpdateView(Long id);
}
