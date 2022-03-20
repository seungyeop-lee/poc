package com.github.seungyeop_lee.spring_scaffold.version1.app.simple_board;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlService;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.list.ListRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimpleBoardService implements CrudlService<SimpleBoard, SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> {
    private final SimpleBoardRepository repository;
    private final SimpleBoardRepository.List listRepository;

    @Override
    public CrudRepository<SimpleBoard> getCrudRepository() {
        return repository;
    }

    @Override
    public ListRepository<SimpleBoardSearchInfo, SimpleBoard> getListRepository() {
        return listRepository;
    }

    @Getter
    @Builder
    public static class SimpleBoardSearchInfo {
        private String name;
        private Long age;
    }
}
