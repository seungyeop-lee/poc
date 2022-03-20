package com.github.seungyeop_lee.spring_scaffold.version1.app.simple_board;


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
@RequestMapping("/simple-board")
public class SimpleBoardController implements CrudlController<
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoardService.SimpleBoardSearchInfo,
        SimpleBoard,
        Page<SimpleBoard>> {

    private final SimpleBoardService service;

    @Override
    public CrudlPath getCrudlPath() {
        return () -> CrudlViewPath.builder()
                .create("/simple_board/create")
                .afterCreate("redirect:/simple-board/%d/read")
                .read("/simple_board/read")
                .update("/simple_board/update")
                .afterUpdate("redirect:/simple-board/%d/read")
                .afterDelete("redirect:/simple-board/list")
                .list("/simple_board/list")
                .build();
    }

    @Override
    public CrudlService<SimpleBoard, SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> getCrudlService() {
        return service;
    }

    @Override
    public BaseBuilder<SimpleBoard, SimpleBoard> getCreateDomainBuilder() {
        return b -> b;
    }

    @Override
    public BaseBuilder<SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo> getSearchInfoBuilder() {
        return b -> SimpleBoardService.SimpleBoardSearchInfo
                .builder()
                .name(b.getName())
                .age(b.getAge())
                .build();
    }

    @Override
    public BaseBuilder<Page<SimpleBoard>, Page<SimpleBoard>> getListViewDataBuilder() {
        return p -> p;
    }

    @Override
    public BaseBuilder<SimpleBoard, SimpleBoard> getReadViewDataBuilder() {
        return b -> b;
    }

    @Override
    public BaseBuilder<SimpleBoard, SimpleBoard> getUpdateViewDataBuilder() {
        return b -> b;
    }

    @Override
    public BaseBuilder<SimpleBoard, SimpleBoard> getUpdateDomainBuilder() {
        return b -> b;
    }
}
