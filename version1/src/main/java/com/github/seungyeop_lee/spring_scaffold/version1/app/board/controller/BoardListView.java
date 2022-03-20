package com.github.seungyeop_lee.spring_scaffold.version1.app.board.controller;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
public class BoardListView {
    Page<BoardListViewItem> listViewItemPage;

    public static BoardListView of(Page<BoardListViewItem> listViewItemPage) {
        BoardListView result = new BoardListView();
        result.listViewItemPage = listViewItemPage;
        return result;
    }

    @Getter
    @Builder
    static class BoardListViewItem {
        private Long id;
        private String name;
        private Long age;
    }
}
