package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.service;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.repository.ListRepository;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.domain.Board;

public interface BoardListRepository extends ListRepository<BoardSearchInfo, Board> {
}
