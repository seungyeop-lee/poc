package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.repository;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.domain.Board;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.domain.QBoard;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.service.BoardListRepository;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.board.service.BoardSearchInfo;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
public class BoardListRepositoryImpl implements BoardListRepository {
    private JPAQueryFactory queryFactory;

    public BoardListRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<Board> list(BoardSearchInfo searchInfo, Pageable pageable) {
        List<Board> fetch = queryFactory
                .selectFrom(QBoard.board)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(QBoard.board.count())
                .from(QBoard.board)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset());

        return PageableExecutionUtils.getPage(fetch, pageable, countQuery::fetchFirst);
    }
}
