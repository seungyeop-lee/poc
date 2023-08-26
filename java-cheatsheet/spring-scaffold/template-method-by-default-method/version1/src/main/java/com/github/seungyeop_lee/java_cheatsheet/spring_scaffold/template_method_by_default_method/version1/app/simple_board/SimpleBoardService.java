package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.simple_board;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.CrudlService;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.CrudRepository;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.ListRepository;
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
