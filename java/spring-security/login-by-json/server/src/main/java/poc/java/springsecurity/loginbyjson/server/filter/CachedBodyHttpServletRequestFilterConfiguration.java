package poc.java.springsecurity.loginbyjson.server.filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CachedBodyHttpServletRequestFilterConfiguration {

    @Bean
    public FilterRegistrationBean<CachedBodyHttpServletRequestFilter> contentCachingWrapFilter() {
        FilterRegistrationBean<CachedBodyHttpServletRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new CachedBodyHttpServletRequestFilter());
        registrationBean.setOrder(Integer.MIN_VALUE);
        return registrationBean;
    }
}
