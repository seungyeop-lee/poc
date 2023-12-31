package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.service;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.domain.Board;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.domain.BoardCrudRepository;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.CrudlService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.CrudRepository;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.ListRepository;
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
