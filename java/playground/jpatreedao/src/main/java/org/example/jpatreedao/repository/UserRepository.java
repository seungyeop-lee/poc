package org.example.jpatreedao.repository;

import fri.util.database.jpa.tree.closuretable.ClosureTableTreeDao;
import fri.util.database.jpa.tree.uniqueconstraints.UniqueConstraintViolationException;
import jakarta.persistence.EntityManager;
import org.example.jpatreedao.common.DbSessionJpaImpl;
import org.example.jpatreedao.entity.User;
import org.example.jpatreedao.entity.UserJpaRepository;
import org.example.jpatreedao.entity.UserTree;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final ClosureTableTreeDao dao;
    private final UserJpaRepository jpaRepository;

    public UserRepository(EntityManager em, UserJpaRepository jpaRepository) {
        DbSessionJpaImpl dbSession = new DbSessionJpaImpl(em);
        this.dao = new ClosureTableTreeDao(User.class, UserTree.class, false, dbSession);
        this.jpaRepository = jpaRepository;
    }

    public User createRoot(User user) {
        try {
            return (User) dao.createRoot(user);
        } catch (UniqueConstraintViolationException e) {
            throw new RuntimeException(e);
        }
    }

    public User addChild(Long parentUserId, User user) {
        User parentUser = jpaRepository.findById(parentUserId).orElseThrow();
        try {
            return (User) dao.addChild(parentUser, user);
        } catch (UniqueConstraintViolationException e) {
            throw new RuntimeException(e);
        }
    }
}
