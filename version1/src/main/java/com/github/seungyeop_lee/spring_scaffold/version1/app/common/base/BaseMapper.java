package com.github.seungyeop_lee.spring_scaffold.version1.app.common.base;

public interface BaseMapper<From, To> {
    To build(From input);
}
