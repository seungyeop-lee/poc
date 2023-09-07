package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.read;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface BaseReadController {
    @GetMapping(ReadPath.READ)
    String readView(@PathVariable Long id, Model model);
}
