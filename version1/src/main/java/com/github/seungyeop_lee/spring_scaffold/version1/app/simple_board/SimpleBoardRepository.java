package com.github.seungyeop_lee.spring_scaffold.version1.app.simple_board;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.repository.CrudRepository;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.repository.ListRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimpleBoardRepository extends JpaRepository<SimpleBoard, Long>, CrudRepository<SimpleBoard> {
    interface List extends ListRepository<SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> {
    }
}
