package org.example.jpatreedao.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.io.Serializable;

@Getter
@EqualsAndHashCode
public class UserTreeId implements Serializable {
    private Long ancestor;
    private Long descendant;
}
