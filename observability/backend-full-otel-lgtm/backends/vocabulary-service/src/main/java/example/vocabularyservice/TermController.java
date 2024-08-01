package example.vocabularyservice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TermController {

    private final TermRepository termRepository;

    @PostMapping("/term")
    public Term createTerm(@RequestBody CreateTermRequest request) {
        log.info("Request creating term: {}", request.term());
        Term saved = termRepository.save(Term.withoutId(request.term(), request.meaning()));
        log.info("Term created: {}", saved);
        return saved;
    }

    public record CreateTermRequest(
            String term,
            String meaning
    ) {
    }
}
