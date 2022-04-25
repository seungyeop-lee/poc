package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.simple_board;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
public class SimpleBoardListRepositoryImpl implements SimpleBoardRepository.List {
    private JPAQueryFactory queryFactory;

    public SimpleBoardListRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<SimpleBoard> list(SimpleBoardService.SimpleBoardSearchInfo searchInfo, Pageable pageable) {
        List<SimpleBoard> fetch = queryFactory
                .selectFrom(QSimpleBoard.simpleBoard)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(QSimpleBoard.simpleBoard.count())
                .from(QSimpleBoard.simpleBoard)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset());

        return PageableExecutionUtils.getPage(fetch, pageable, countQuery::fetchFirst);
    }
}
