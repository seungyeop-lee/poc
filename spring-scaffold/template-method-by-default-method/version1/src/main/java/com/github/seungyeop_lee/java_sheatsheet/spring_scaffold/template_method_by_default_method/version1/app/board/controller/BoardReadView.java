package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.domain.Board;
import lombok.Data;

@Data
public class BoardReadView {
    private String name;
    private Long age;

    public static BoardReadView from(Board input) {
        BoardReadView result = new BoardReadView();
        result.name = input.getName();
        result.age = input.getAge();
        return result;
    }
}
