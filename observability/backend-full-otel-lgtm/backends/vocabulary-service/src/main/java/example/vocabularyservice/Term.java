package example.vocabularyservice;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String term;

    private String meaning;

    public static Term withoutId(
            String term,
            String meaning
    ) {
        Term result = new Term();
        result.term = term;
        result.meaning = meaning;
        return result;
    }
}
