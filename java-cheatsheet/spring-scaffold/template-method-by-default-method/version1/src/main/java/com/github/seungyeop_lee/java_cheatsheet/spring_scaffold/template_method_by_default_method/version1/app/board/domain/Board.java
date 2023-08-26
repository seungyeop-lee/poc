package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.domain;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.IdGetter;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.Updatable;
import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
public class Board implements Updatable<Board>, IdGetter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long age;

    public static Board of(
            String name,
            Long age
    ) {
        Board result = new Board();
        result.name = name;
        result.age = age;
        return result;
    }

    @Override
    public void update(Board updateInfo) {
        name = updateInfo.getName();
        age = updateInfo.getAge();
    }
}
