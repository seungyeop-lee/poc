package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.controller.delete;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface BaseDeleteController {
    @PostMapping(DeletePath.DELETE)
    String delete(@PathVariable Long id);
}
