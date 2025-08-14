package ish.user.service;

import ish.user.dto.glossary.SearchCriteria;
import ish.user.model.glossary.Term;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@DirtiesContext
@Sql(scripts = "/glossary.sql")  // Load glossary entries from glossary.sql before running the tests
public class TermServiceTest {

    @Autowired
    private TermService termService;

    @BeforeEach
    public void setUp() {
        // Setup before each test if necessary
    }

    @Test
    void testContextLoads() {
        Assertions.assertThat(termService).isNotNull();
    }

    @Test
    public void testFindTermByKeyword() {
        Optional<Term> term = termService.findTermByKeyword("Encryption");
        assertTrue(term.isPresent());

        Term encryptionTerm = term.get();
        assertEquals("Encryption", encryptionTerm.getKeyword());
        assertEquals("Encodes information to protect data", encryptionTerm.getDefinition());  // Check definition
        assertEquals("IT Security", encryptionTerm.getCategory().getName());  // Check category
        assertEquals("The process of encoding information to protect it from unauthorized access.", encryptionTerm.getDescription());
    }


    @Test
    void testFindByCriteriaWithCategory() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .category("Data").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(1);
    }

    @Test
    void testFindByCriteriaWithCategories() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .categories(List.of("Data", "IT")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(2);
        Assertions.assertThat(terms).anyMatch(t -> "IT".equalsIgnoreCase(t.getCategory().getName()));
        Assertions.assertThat(terms).anyMatch(t -> "Data".equalsIgnoreCase(t.getCategory().getName()));
    }

    @Test
    void testFindByCriteriaWithCategoriesAndPagination() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .categories(List.of("IT Security")).build();
        Pageable sizeThreePage = PageRequest.of(0, 3);
        Page<Term> terms = termService.findByCriteria(searchCriteria, sizeThreePage);

        Assertions.assertThat(terms).isNotEmpty();
        Assertions.assertThat(terms.getTotalElements()).isEqualTo(6);

        //Assertions.assertThat(terms).anyMatch(t -> "IT".equalsIgnoreCase(t.getCategory()));
        //Assertions.assertThat(terms).anyMatch(t -> "Data".equalsIgnoreCase(t.getCategory()));
    }

    @Test
    void testFindByCriteriaWithCategoriesAndSortedPagination() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .categories(List.of("IT Security")).build();
        Pageable sizeThreePageSortedByKeyword = PageRequest.of(1, 3, Sort.by("keyword").ascending());
        Page<Term> terms = termService.findByCriteria(searchCriteria, sizeThreePageSortedByKeyword);

        Assertions.assertThat(terms).isNotEmpty();
        Assertions.assertThat(terms.getTotalElements()).isEqualTo(6);
        Assertions.assertThat(terms.get().map(Term::getKeyword).toList().get(0)).isEqualTo("Encryption");
    }

    @Test
    void testFindByCriteriaWithKeyword() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .keyword("Antivirus").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(1);
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithKeywords() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .keywords(List.of("Authentication", "Autorisierung")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(2);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Autorisierung".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithKeywordLike() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .keywordLike("Ant").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(1);
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithKeywordsLike() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .keywordsLike(List.of("Ant", "Au")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(3);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Autorisierung".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithSynonymLike() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .synonymLike("Credential").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(1);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithSynonymsLike() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .synonymsLike(List.of("Credential", "Web-based", "Crypto")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(3);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Encryption".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Cloud Computing".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithSynonym() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .synonym("Secure Tunnel").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(1);
        Assertions.assertThat(terms).anyMatch(t -> "VPN".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithSynonyms() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .synonyms(List.of("Identity Verification", "Virus Protection")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(2);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithKeywordsOrSynonym() {
        SearchCriteria searchCriteria = SearchCriteria.builder()
                .keywordsOrSynonyms(List.of("Au", "Removal", "Tunnel")).build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(4);
        Assertions.assertThat(terms).anyMatch(t -> "Authentication".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Autorisierung".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "Antivirus".equalsIgnoreCase(t.getKeyword()));
        Assertions.assertThat(terms).anyMatch(t -> "VPN".equalsIgnoreCase(t.getKeyword()));
    }

    @Test
    void testFindByCriteriaWithAll() {
        SearchCriteria searchCriteria = SearchCriteria.builder().all("th").build();
        List<Term> terms = termService.findByCriteria(searchCriteria);

        Assertions.assertThat(terms).size().isEqualTo(5);
    }

    @Test
    public void testEnrichTextWithGlossaryTerms() {
        String text = "Using a firewall is crucial in modern IT security systems. Antivirus software helps detect " +
                "malware, and VPNs (sometimes called secure tunnel) are commonly used for secure connections.";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        // Check if key terms like Firewall, Antivirus, and VPN are found in the enriched mapping
        assertThat(enrichedMapping, hasKey("firewall"));
        assertThat(enrichedMapping, hasKey("Antivirus"));
        assertThat(enrichedMapping, hasKey("VPNs"));

        // org.hamcrest.Matchers.not
        //assertThat(enrichedMapping, not(hasKey("secure tunnel")) );

        // Check that the mapped terms match the glossary entries
        Optional<Term> firewallTerm = termService.findTermByKeyword("Firewall");
        assertTrue(firewallTerm.isPresent());
        assertEquals(firewallTerm.get().getDescription(), enrichedMapping.get("firewall").getDescription());

        Optional<Term> antivirusTerm = termService.findTermByKeyword("Antivirus");
        assertTrue(antivirusTerm.isPresent());
        assertEquals(antivirusTerm.get().getDescription(), enrichedMapping.get("Antivirus").getDescription());

        Optional<Term> vpnTerm = termService.findTermByKeyword("VPN");
        assertTrue(vpnTerm.isPresent());
        assertEquals(vpnTerm.get().getDescription(), enrichedMapping.get("VPNs").getDescription());
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithPunctuationMarks() {
        String text = "Is a secure tunnel, if I may ask, really the same as a VPN?";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat(enrichedMapping, hasKey("secure tunnel"));
        assertThat(enrichedMapping, not(hasKey("secure tunnel,")));

        assertThat(enrichedMapping, hasKey("VPN"));
        assertThat(enrichedMapping, not(hasKey("VPN?")));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithAcronyms() {
        String text = "I love xml and I love XML, but I hate XMLT.";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat(enrichedMapping, hasKey("XML"));
        assertThat(enrichedMapping, hasKey("xml"));
        assertThat(enrichedMapping, not(hasKey("XMLT")));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithGermanWords() {
        String text = "Autorisierung ist eine Singularform von Autorisierungen. So funktioniert Sprache!";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat(enrichedMapping, hasKey("Autorisierung"));
        assertThat(enrichedMapping, hasKey("Autorisierungen"));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithGenitive() {
        String text = "This is my VPN's address.";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        // Genitive singular is matched fully (in contrast to Genitive plural)
        assertThat(enrichedMapping, hasKey("VPN's"));
        assertThat(enrichedMapping, not(hasKey("VPN")));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithCompoundWords() {
        String text = "Enhance security by using a secure tunnel and performing user authentication.";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat("Compound-word synonym 'secure tunnel' for term 'VPN' not recognized.", enrichedMapping, hasKey("secure tunnel"));
        assertThat("Compound-word synonym 'user authentication' for term 'authentication' not recognized.", enrichedMapping, hasKey("user authentication"));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithCompoundWordsInPlural() {
        String text = "Secure tunnels really are what VPNs were made for!";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat("Plural form 'VPNs' for term 'VPN' not recognized.", enrichedMapping, hasKey("VPNs"));
        assertThat("Plural compound-word synonym 'secure tunnels' for term 'VPN' not recognized.", enrichedMapping, hasKey("Secure tunnels"));
    }

    @Test
    public void testEnrichTextWithGlossaryTerms_WithCompoundWordsInGenitivePluralAndPunctuationMarks() {
        String text = "Secure tunnels' security, if I may say so myself, really is the same as VPNs' security!";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertThat("Plural form 'VPNs' for term 'VPN' not recognized.", enrichedMapping, hasKey("Secure tunnels"));
        assertThat(enrichedMapping, not(hasKey("Secure tunnels'")));

        assertThat("Plural compound-word synonym 'secure tunnels' for term 'VPN' not recognized.", enrichedMapping, hasKey("VPNs"));
        assertThat(enrichedMapping, not(hasKey("VPNs'")));
    }

    @Test
    void testFilterLongestMatches() {
        String text = "User authentications are an authenticating mean; singular would be user authentication (edge case: User authentications)";
        Map<String, Term> enrichedMapping = termService.enrichTextWithGlossaryTerms(text);
        Map<String, Term> filteredEnrichedMapping = termService.filterLongestMatches(enrichedMapping, text);

        // Assert that the mapping is not null and contains some terms
        assertNotNull(enrichedMapping);
        assertFalse(enrichedMapping.isEmpty());

        assertNotNull(filteredEnrichedMapping);
        assertFalse(filteredEnrichedMapping.isEmpty());

        assertThat(enrichedMapping, hasKey("authentication"));
        assertThat(enrichedMapping, hasKey("authentications"));

        assertThat(filteredEnrichedMapping, not(hasKey("authentication")));
        assertThat(filteredEnrichedMapping, not(hasKey("authentications")));
    }

}