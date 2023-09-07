package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base;

public interface Updatable<UpdateInfoType> {
    void update(UpdateInfoType updateInfo);
}
