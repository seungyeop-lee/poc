package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.update;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface BaseUpdateController<InObjectType> {
    @GetMapping(UpdatePath.UPDATE)
    String updateView(@PathVariable Long id, Model model);

    @PostMapping(UpdatePath.UPDATE)
    String update(@PathVariable Long id, InObjectType param);

}
