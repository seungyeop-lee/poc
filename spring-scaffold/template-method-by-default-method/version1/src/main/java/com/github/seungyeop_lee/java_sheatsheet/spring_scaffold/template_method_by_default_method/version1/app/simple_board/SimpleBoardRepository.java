package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.simple_board;

import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.CrudRepository;
import com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.repository.ListRepository;
import org.springframework.data.repository.Repository;

public interface SimpleBoardRepository extends Repository<SimpleBoard, Long>, CrudRepository<SimpleBoard> {
    interface List extends ListRepository<SimpleBoardService.SimpleBoardSearchInfo, SimpleBoard> {
    }
}
