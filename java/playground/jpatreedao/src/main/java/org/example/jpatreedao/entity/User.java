package org.example.jpatreedao.entity;

import fri.util.database.jpa.tree.closuretable.ClosureTableTreeNode;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
public class User implements ClosureTableTreeNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "ancestor")
    private List<UserTree> ancestorList;

    @OneToMany(mappedBy = "descendant")
    private List<UserTree> descendantList;

    public static User of(String name) {
        User user = new User();
        user.name = name;
        return user;
    }

    @Override
    public ClosureTableTreeNode clone() {
        return of(name);
    }
}
