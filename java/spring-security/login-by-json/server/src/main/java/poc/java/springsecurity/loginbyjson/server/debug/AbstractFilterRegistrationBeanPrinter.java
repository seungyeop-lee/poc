package poc.java.springsecurity.loginbyjson.server.debug;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.AbstractFilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AbstractFilterRegistrationBeanPrinter {

    private final ApplicationContext applicationContext;

    @PostConstruct
    public void print() {
        Map<String, AbstractFilterRegistrationBean> filters = applicationContext.getBeansOfType(AbstractFilterRegistrationBean.class);

        List<AbstractFilterRegistrationBean> sortedFilters = filters.values().stream()
                .sorted(Comparator.comparingInt(AbstractFilterRegistrationBeanPrinter::getOrder))
                .collect(Collectors.toList());

        log.debug("======================= Filters =======================");
        for (AbstractFilterRegistrationBean filter : sortedFilters) {
            log.debug("Filter class: {}, Order: {}", filter.getFilter().getClass().getName(), getOrder(filter));
        }
        log.debug("======================= Filters =======================");
    }

    private static int getOrder(AbstractFilterRegistrationBean filter) {
        return (filter instanceof Ordered) ? ((Ordered) filter).getOrder() : Ordered.LOWEST_PRECEDENCE;
    }
}
