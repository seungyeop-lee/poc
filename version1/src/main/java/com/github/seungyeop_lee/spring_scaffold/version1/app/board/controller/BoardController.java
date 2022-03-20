package com.github.seungyeop_lee.spring_scaffold.version1.app.board.controller;

import com.github.seungyeop_lee.spring_scaffold.version1.app.board.domain.Board;
import com.github.seungyeop_lee.spring_scaffold.version1.app.board.service.BoardCrudlService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.board.service.BoardSearchInfo;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseBuilder;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlController;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlPath;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlViewPath;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController implements CrudlController<
        Board,
        BoardFormParameter,
        BoardReadView,
        BoardFormParameter,
        Board,
        BoardReadView,
        BoardSearchParameter,
        BoardSearchInfo,
        Board,
        BoardListView> {

    private final BoardCrudlService service;

    @Override
    public CrudlPath getCrudlPath() {
        return () -> CrudlViewPath.builder()
                .create("/board/create")
                .afterCreate("redirect:/board/%d/read")
                .read("/board/read")
                .update("/board/update")
                .afterUpdate("redirect:/board/%d/read")
                .afterDelete("redirect:/board/list")
                .list("/board/list")
                .build();
    }

    @Override
    public CrudlService<Board, Board, BoardSearchInfo, Board> getCrudlService() {
        return service;
    }

    @Override
    public BaseBuilder<BoardFormParameter, Board> getCreateDomainBuilder() {
        return input -> Board.of(input.getName(), input.getAge());
    }

    @Override
    public BaseBuilder<BoardSearchParameter, BoardSearchInfo> getSearchInfoBuilder() {
        return input -> BoardSearchInfo.builder()
                .name(input.getName())
                .age(input.getAge())
                .build();
    }

    @Override
    public BaseBuilder<Page<Board>, BoardListView> getListViewDataBuilder() {
        return input -> BoardListView.of(
                input.map(board -> BoardListView.BoardListViewItem.builder()
                        .id(board.getId())
                        .name(board.getName())
                        .age(board.getAge()).build())
        );
    }

    @Override
    public BaseBuilder<Board, BoardReadView> getReadViewDataBuilder() {
        return BoardReadView::from;
    }

    @Override
    public BaseBuilder<Board, BoardReadView> getUpdateViewDataBuilder() {
        return BoardReadView::from;
    }

    @Override
    public BaseBuilder<BoardFormParameter, Board> getUpdateDomainBuilder() {
        return input -> Board.of(input.getName(), input.getAge());
    }
}
