package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.controller.create;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

public interface BaseCreateController<InObjectType> {
    @GetMapping(CreatePath.CREATE)
    String createView(InObjectType param, Model model);

    @PostMapping(CreatePath.CREATE)
    String create(InObjectType param);
}
