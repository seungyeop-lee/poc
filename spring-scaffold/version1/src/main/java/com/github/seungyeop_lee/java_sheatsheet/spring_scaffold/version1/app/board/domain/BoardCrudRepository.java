package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.domain;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository.CrudRepository;
import org.springframework.data.repository.Repository;

public interface BoardCrudRepository extends Repository<Board, Long>, CrudRepository<Board> {
}
