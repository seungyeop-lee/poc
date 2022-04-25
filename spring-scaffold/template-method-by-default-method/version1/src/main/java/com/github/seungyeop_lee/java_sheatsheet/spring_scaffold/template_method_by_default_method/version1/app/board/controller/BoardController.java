package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.controller;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlViewPath;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.CrudlService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.domain.Board;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.service.BoardCrudlService;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.board.service.BoardSearchInfo;
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
    public BaseMapper<BoardFormParameter, Board> getCreateDomainMapper() {
        return input -> Board.of(input.getName(), input.getAge());
    }

    @Override
    public BaseMapper<BoardSearchParameter, BoardSearchInfo> getSearchInfoMapper() {
        return input -> BoardSearchInfo.builder()
                .name(input.getName())
                .age(input.getAge())
                .build();
    }

    @Override
    public BaseMapper<Page<Board>, BoardListView> getListViewDataMapper() {
        return input -> BoardListView.of(
                input.map(board -> BoardListView.BoardListViewItem.builder()
                        .id(board.getId())
                        .name(board.getName())
                        .age(board.getAge()).build())
        );
    }

    @Override
    public BaseMapper<Board, BoardReadView> getReadViewDataMapper() {
        return BoardReadView::from;
    }

    @Override
    public BaseMapper<Board, BoardReadView> getUpdateViewDataMapper() {
        return BoardReadView::from;
    }

    @Override
    public BaseMapper<BoardFormParameter, Board> getUpdateDomainMapper() {
        return input -> Board.of(input.getName(), input.getAge());
    }
}
