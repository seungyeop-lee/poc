package org.example.jpatreedao.entity;

import fri.util.database.jpa.tree.closuretable.ClosureTableTreeNode;
import fri.util.database.jpa.tree.closuretable.TreePath;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserTree implements TreePath {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "ancestor", nullable = false)
    private ClosureTableTreeNode ancestor;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "descendant", nullable = false)
    private ClosureTableTreeNode descendant;

    @Column(nullable = false)
    private int depth;

    @Transient
    private int orderIndex;
}
