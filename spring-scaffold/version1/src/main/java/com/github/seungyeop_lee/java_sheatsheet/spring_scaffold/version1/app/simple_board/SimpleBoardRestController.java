package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.simple_board;


import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.rest_controller.CrudlRestController;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.base.BaseMapper;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.version1.app.common.crudl.service.CrudlService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/simple-board")
public class SimpleBoardRestController implements CrudlRestController<
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        SimpleBoard,
        ResponseEntity<?>,
        SimpleBoard,
        SimpleBoardService.SimpleBoardSearchInfo,
        SimpleBoard,
        Page<SimpleBoard>> {

    private final SimpleBoardService service;

    @Override
    public CrudlService<SimpleBoard, SimpleBoard, SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> getCrudlService() {
        return service;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getCreateDomainMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getCreateOutDataMapper() {
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
    public BaseMapper<Page<SimpleBoard>, Page<SimpleBoard>> getListOutDataMapper() {
        return p -> p;
    }

    @Override
    public ResponseEntity<?> getOutObject() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getReadOutDataMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getUpdateDataMapper() {
        return b -> b;
    }

    @Override
    public BaseMapper<SimpleBoard, SimpleBoard> getUpdateOutDataMapper() {
        return b -> b;
    }
}
