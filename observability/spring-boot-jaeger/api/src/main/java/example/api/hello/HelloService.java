package example.api.hello;

import io.opentelemetry.instrumentation.annotations.WithSpan;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class HelloService {

    private final HelloRepository helloRepository;

    @WithSpan
    public String hello() {
        return helloRepository.findAll().getFirst().getMessage();
    }

    @PostConstruct
    public void init() {
        helloRepository.save(new Hello("Hello, World!"));
    }
}
