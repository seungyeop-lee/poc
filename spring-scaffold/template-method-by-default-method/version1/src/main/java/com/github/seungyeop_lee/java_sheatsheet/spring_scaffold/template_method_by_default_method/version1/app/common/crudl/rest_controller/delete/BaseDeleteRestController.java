package com.github.seungyeop_lee.java_sheatsheet.spring_scaffold.template_method_by_default_method.version1.app.common.crudl.rest_controller.delete;

import org.springframework.web.bind.annotation.PathVariable;

public interface BaseDeleteRestController<OutObjectType> {
    OutObjectType delete(@PathVariable Long id);
}
