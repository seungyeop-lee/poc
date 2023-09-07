package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.domain;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.metadata.AccountMetadata;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(path = AccountMetadata.path)
public interface AccountRepository extends JpaRepository<Account, Long>, QuerydslPredicateExecutor<Account> {
    @Override
    @RestResource(exported = false)
    Page<Account> findAll(Pageable pageable);
}
