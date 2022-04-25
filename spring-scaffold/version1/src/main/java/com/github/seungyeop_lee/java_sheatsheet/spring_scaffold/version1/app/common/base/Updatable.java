package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.base;

public interface Updatable<UpdateInfoType> {
    void update(UpdateInfoType updateInfo);
}
