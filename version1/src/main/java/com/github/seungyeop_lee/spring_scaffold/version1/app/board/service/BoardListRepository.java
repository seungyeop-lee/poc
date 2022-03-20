package com.github.seungyeop_lee.spring_scaffold.version1.app.board.service;

import com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain.Board;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListRepository;

public interface BoardListRepository extends ListRepository<BoardSearchInfo, Board> {
}
