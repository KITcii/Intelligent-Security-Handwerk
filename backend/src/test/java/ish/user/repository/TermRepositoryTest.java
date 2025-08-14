package ish.user.repository;

import ish.user.model.glossary.Term;
import ish.user.repository.glossary.TermRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Sql(scripts = "/glossary.sql")
class TermRepositoryTest {

    @Autowired
    private TermRepository repository;

    @Test
    void findByKeyword() {
        Optional<Term> term = repository.findByKeyword("Firewall");
        Assertions.assertThat(term).isNotEmpty();
        assertEquals(term.get().getDefinition(), "Monitors and controls network traffic");
    }

    @Test
    void findByTermOrSynonym() {
        List<Term> terms = repository.findByTermOrSynonym("Firewall");

        Assertions.assertThat(terms).size().isEqualTo(1);
        Assertions.assertThat(terms).extracting(Term::getKeyword).contains("Firewall");
    }

    @Test
    void findAllByTermOrSynonymIn() {
        // Synonyms for Firewall, Antivirus, and VPN
        List<Term> terms = repository.findAllByTermOrSynonymIn(Arrays.asList("Security Wall", "Virus Protection", "Secure Tunnel"));
        Assertions.assertThat(terms).size().isEqualTo(3);

        Assertions.assertThat(terms).anyMatch(t -> "Firewall".equals(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equals(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "VPN".equals(t.getKeyword()));
    }
}