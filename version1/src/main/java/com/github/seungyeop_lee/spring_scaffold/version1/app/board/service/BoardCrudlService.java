package com.github.seungyeop_lee.spring_scaffold.version1.app.board.service;

import com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain.Board;
import com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain.BoardCrudRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardCrudlService implements CrudlService<Board, Board, BoardSearchInfo, Board> {
    private final BoardCrudRepository repository;
    private final BoardListRepository listRepository;


    @Override
    public CrudRepository<Board> getCrudRepository() {
        return repository;
    }

    @Override
    public ListRepository<BoardSearchInfo, Board> getListRepository() {
        return listRepository;
    }
}
