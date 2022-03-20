package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller;

import lombok.Builder;

@Builder
public class CrudlViewPath {
    private String create;
    private String afterCreate;
    private String read;
    private String update;
    private String afterUpdate;
    private String afterDelete;
    private String list;

    public String getCreate() {
        return create;
    }

    public String getAfterCreate(Long id) {
        return String.format(afterCreate, id);
    }

    public String getRead() {
        return read;
    }

    public String getUpdate() {
        return update;
    }

    public String getAfterUpdate(Long id) {
        return String.format(afterCreate, id);
    }

    public String getAfterDelete() {
        return afterDelete;
    }

    public String getList() {
        return list;
    }
}
