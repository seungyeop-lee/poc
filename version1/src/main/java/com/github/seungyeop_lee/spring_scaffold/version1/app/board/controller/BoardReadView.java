package com.github.seungyeop_lee.spring_scaffold.version1.app.board.controller;

import com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain.Board;
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
