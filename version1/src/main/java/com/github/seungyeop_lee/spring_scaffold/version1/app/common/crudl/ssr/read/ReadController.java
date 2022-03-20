package com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.read;

import com.github.seungyeop_lee.spring_scaffold.version1.app.common.base.BaseBuilder;
import com.github.seungyeop_lee.spring_scaffold.version1.app.common.crudl.ssr.CrudlConst;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface ReadController<DomainType, ViewDataType> {
    @GetMapping(ReadPath.READ)
    default String readView(@PathVariable Long id, Model model) {
        DomainType found = getReadService().findById(id);

        model.addAttribute(getReadResultObjName(), getReadViewDataBuilder().build(found));
        model.addAttribute("id", id);

        return getReadPath().getReadView();
    }

    default String getReadResultObjName() {
        return CrudlConst.ModelAttrName.READ_RESULT;
    }

    ReadPath getReadPath();
    ReadService<DomainType> getReadService();
    BaseBuilder<DomainType, ViewDataType> getReadViewDataBuilder();
}
