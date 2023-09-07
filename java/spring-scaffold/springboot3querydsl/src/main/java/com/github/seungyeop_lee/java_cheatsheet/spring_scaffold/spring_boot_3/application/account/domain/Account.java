package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty
    @Column(nullable = false, unique = true)
    private String loginId;

    @NotEmpty
    @Column(nullable = false)
    private String name;

    private Long age;

    private String email;

    @NotEmpty
    @Column(nullable = false)
    private String gender;

    @ElementCollection
    private List<String> interest;

    private String joinPath;

    @NotNull
    @Column(nullable = false)
    private Boolean isLock;

    private OffsetDateTime birthday;
}
