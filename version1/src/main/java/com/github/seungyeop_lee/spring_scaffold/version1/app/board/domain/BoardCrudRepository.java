package com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardCrudRepository extends JpaRepository<Board, Long>, CrudRepository<Board> {
}
