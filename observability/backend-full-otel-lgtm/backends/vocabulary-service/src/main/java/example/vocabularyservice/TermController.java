package example.vocabularyservice;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TermController {

    private final TermRepository termRepository;

    @PostMapping("/term")
    public Term createTerm(@RequestBody CreateTermRequest request) {
        return termRepository.save(Term.withoutId(request.term(), request.meaning()));
    }

    public record CreateTermRequest(
            String term,
            String meaning
    ) {
    }
}
