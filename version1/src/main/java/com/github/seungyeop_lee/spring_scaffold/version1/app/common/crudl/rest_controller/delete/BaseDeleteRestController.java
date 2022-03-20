package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.rest_controller.delete;

import org.springframework.web.bind.annotation.PathVariable;

public interface BaseDeleteRestController<OutObjectType> {
    OutObjectType delete(@PathVariable Long id);
}
