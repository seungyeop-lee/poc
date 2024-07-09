package example.api.hello;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class HelloService {

    private final HelloRepository helloRepository;

    @WithSpan
    public String hello() {
        log.info("hello in service");
        return helloRepository.findAll().getFirst().getMessage();
    }

    @PostConstruct
    public void init() {
        helloRepository.save(new Hello("Hello, World!"));
    }
}
