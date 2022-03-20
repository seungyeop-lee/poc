package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.list;

import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public interface BaseListController<InObjectType> {
    @GetMapping(ListPath.LIST)
    String listView(Pageable pageable, InObjectType param, Model model);
}
