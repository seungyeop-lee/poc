package org.example.jpatreedao.repository;

import jakarta.persistence.EntityManager;
import org.example.jpatreedao.entity.User;
import org.example.jpatreedao.entity.UserJpaRepository;
import org.example.jpatreedao.entity.UserTree;
import org.example.jpatreedao.entity.UserTreeJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserRepositoryTest {

    @Autowired
    UserRepository repository;

    @Autowired
    UserJpaRepository userRepo;

    @Autowired
    UserTreeJpaRepository treeRepo;

    @Test
    void createTest() {
        repository.createRoot(User.of("A"));

        List<User> allUser = userRepo.findAll();
        assertThat(allUser).hasSize(1);
        List<UserTree> allTree = treeRepo.findAll();
        assertThat(allTree).hasSize(1);
    }

    @Test
    void addChildTest() {
        User root = repository.createRoot(User.of("A"));

        repository.addChild(root.getId(), User.of("B"));

        List<User> allUser = userRepo.findAll();
        assertThat(allUser).hasSize(2);
        List<UserTree> allTree = treeRepo.findAll();
        assertThat(allTree).hasSize(3);
    }

}
