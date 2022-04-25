package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.service;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardSearchInfo {
    private String name;
    private Long age;
}
