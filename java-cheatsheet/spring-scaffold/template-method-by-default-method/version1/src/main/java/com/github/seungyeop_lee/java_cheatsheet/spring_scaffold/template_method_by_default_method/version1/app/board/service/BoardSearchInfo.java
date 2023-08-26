package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.service;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardSearchInfo {
    private String name;
    private Long age;
}
