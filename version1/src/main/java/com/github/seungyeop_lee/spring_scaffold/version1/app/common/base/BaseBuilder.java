package com.github.seungyeop_lee.spring_scaffold.version1.app.common.base;

public interface BaseBuilder<From, To> {
    To build(From input);
}
