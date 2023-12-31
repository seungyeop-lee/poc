package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.simple_board;


import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlController;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlPath;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.CrudlViewPath;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.service.CrudlService;
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
                .create("simple_board/create")
                .afterCreate("redirect:/simple-board/%d/read")
                .read("simple_board/read")
                .update("simple_board/update")
                .afterUpdate("redirect:/simple-board/%d/read")
                .afterDelete("redirect:/simple-board/list")
                .list("simple_board/list")
                .build();
    }

    @Override
    public CrudlService<SimpleBoard, SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> getCrudlService() {
        return service;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getCreateDomainMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo> getSearchInfoMapper() {
        return b -> SimpleBoardService.SimpleBoardSearchInfo
                .builder()
                .name(b.getName())
                .age(b.getAge())
                .build();
    }

    @Override
    public BaseMapper<Page<SimpleBoard>, Page<SimpleBoard>> getListViewDataMapper() {
        return p -> p;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getReadViewDataMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getUpdateViewDataMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getUpdateDomainMapper() {
        return b -> b;
    }
}
