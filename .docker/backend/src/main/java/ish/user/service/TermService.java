package ish.user.service;

import ish.user.dto.glossary.SearchCriteria;
import ish.user.model.glossary.Category;
import ish.user.model.glossary.Term;
import ish.user.dto.glossary.TermLight;
import ish.user.model.glossary.TermSpecifications;
import ish.user.repository.glossary.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TermService {

    private TermRepository termRepository;

    @Autowired
    public TermService(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    // Find glossary entry by exact keyword
    public Optional<Term> findTermByKeyword(String keyword) {
        return termRepository.findByKeyword(keyword);
    }

    // Find glossary entries by a keyword (either as term or as synonym)
    public List<Term> findTermsByKeywordOrSynonym(String keyword) {
        return termRepository.findByTermOrSynonym(keyword);
    }

    // Find all terms that match a list of keywords, including synonyms
    public List<Term> findAllByKeywordsIncludingSynonyms(List<String> keywords) {
        return termRepository.findAllByTermOrSynonymIn(keywords);
    }

    private Specification<Term> criteriaToSpecification(SearchCriteria searchCriteria) {
        Specification<Term> spec = Specification.where(null);

        if (!CollectionUtils.isEmpty(searchCriteria.getIds()))
            spec = spec.and(TermSpecifications.hasId(searchCriteria.getIds()));

        if (CollectionUtils.isEmpty(searchCriteria.getIds()) && StringUtils.hasLength(searchCriteria.getId()))
            spec = spec.and(TermSpecifications.hasId(searchCriteria.getId()));

        // TODO Use either keywords or keywords-like, same with the singular keyword
        if (!CollectionUtils.isEmpty(searchCriteria.getKeywordsLike()))
            spec = spec.and(TermSpecifications.hasKeywordLike(searchCriteria.getKeywordsLike()));

        if (CollectionUtils.isEmpty(searchCriteria.getKeywordsLike()) && StringUtils.hasLength(searchCriteria.getKeywordLike()))
            spec = spec.and(TermSpecifications.hasKeywordLike(searchCriteria.getKeywordLike()));

        if (!CollectionUtils.isEmpty(searchCriteria.getKeywords()))
            spec = spec.and(TermSpecifications.hasKeyword(searchCriteria.getKeywords()));

        if (CollectionUtils.isEmpty(searchCriteria.getKeywords()) && StringUtils.hasLength(searchCriteria.getKeyword()))
            //spec = spec.and(TermSpecifications.hasKeyword(searchCriteria.getKeyword()));
            spec = spec.and(TermSpecifications.hasKeyword(List.of(searchCriteria.getKeyword())));

        if (!CollectionUtils.isEmpty(searchCriteria.getCategories()))
            spec = spec.and(TermSpecifications.hasCategory(searchCriteria.getCategories()));

        if (CollectionUtils.isEmpty(searchCriteria.getCategories()) && StringUtils.hasLength(searchCriteria.getCategory()))
            spec = spec.and(TermSpecifications.hasCategory(searchCriteria.getCategory()));

        // TODO Use either keywords or keywords-like, same with the singular keyword
        if (!CollectionUtils.isEmpty(searchCriteria.getSynonymsLike()))
            spec = spec.and(TermSpecifications.hasSynonymsLike(searchCriteria.getSynonymsLike()));

        if (CollectionUtils.isEmpty(searchCriteria.getSynonymsLike()) && StringUtils.hasLength(searchCriteria.getSynonymLike()))
            spec = spec.and(TermSpecifications.hasSynonymsLike(searchCriteria.getSynonymLike()));

        if (!CollectionUtils.isEmpty(searchCriteria.getSynonyms()))
            spec = spec.and(TermSpecifications.hasSynonyms(searchCriteria.getSynonyms()));

        if (CollectionUtils.isEmpty(searchCriteria.getSynonyms()) && StringUtils.hasLength(searchCriteria.getSynonym()))
            spec = spec.and(TermSpecifications.hasSynonyms(searchCriteria.getSynonym()));

        if (!CollectionUtils.isEmpty(searchCriteria.getKeywordsOrSynonyms()))
            spec = spec.and(TermSpecifications.hasSynonymsOrKeywordLike(searchCriteria.getKeywordsOrSynonyms()));

        if (StringUtils.hasLength(searchCriteria.getAll())) {
            String parameter = searchCriteria.getAll();
            Specification<Term> all = TermSpecifications.hasKeywordLike(parameter)
                    .or(TermSpecifications.hasDefinition(parameter))
                    .or(TermSpecifications.hasDescription(parameter))
                    .or(TermSpecifications.hasSynonymsLike(parameter));
            spec = spec.and(all);
        }
        return spec;
    }

    // @see: https://docs.spring.io/spring-data/relational/reference/repositories/core-extensions.html#core.web.basic.paging-and-sorting
    public Page<Term> findByCriteria(SearchCriteria searchCriteria, Pageable pageable) {
        Specification<Term> spec = criteriaToSpecification(searchCriteria);
        return termRepository.findAll(spec, pageable);
    }

    public Page<TermLight> findLightByCriteria(SearchCriteria searchCriteria, Pageable pageable) {
        Specification<Term> spec = criteriaToSpecification(searchCriteria);
        return termRepository.findAllBySpecification(spec, pageable, TermLight.class);
    }

    public List<Term> findByCriteria(SearchCriteria searchCriteria) {
        Specification<Term> spec = criteriaToSpecification(searchCriteria);
        return termRepository.findAll(spec);
    }

    // Retrieve all keywords and synonyms combined into a single list
    public List<String> getAllKeywordsAndSynonyms() {
        // Get all terms from the repository
        List<Term> terms = termRepository.findAll();

        // Create a list to hold the keywords and synonyms
        List<String> allKeywordsAndSynonyms = new ArrayList<>();

        // Loop through each term and add both the keyword and its synonyms to the list
        for (Term term : terms) {
            allKeywordsAndSynonyms.add(term.getKeyword());  // Add the term itself
            allKeywordsAndSynonyms.addAll(term.getSynonyms());  // Add the synonyms
        }

        return allKeywordsAndSynonyms;
    }

    public Map<String, Term> enrichTextWithGlossaryTerms(String text) {
        Map<String, Term> termMapping = new HashMap<>();

        // Get all glossary terms and synonyms
        List<Term> terms = termRepository.findAll();
        List<String> glossaryTermsAndSynonyms = getAllGlossaryTermsAndSynonyms(terms);

        // Check for compound words and other variations within the text
        for (String glossaryTerm : glossaryTermsAndSynonyms) {
            // Normalize the glossary term or synonym
            String normalizedGlossaryTerm = normalizeText(glossaryTerm);

            // Look for the exact match or slight variations in the text (handle plural/singular, genitive cases)
            List<String> matchedStrings = findMatchedStrings(text, glossaryTerm); // Find matches in the original text

            for (String matchedString : matchedStrings) {
                Term matchedTerm = findTermByGlossaryOrSynonym(terms, glossaryTerm);
                if (matchedTerm != null) {
                    termMapping.put(matchedString, matchedTerm); // Use the original matched string as the key
                }
            }
        }

        return termMapping;
    }

    public Map<String, Term> filterLongestMatches(Map<String, Term> enrichedTerms, String originalText) {
        // List to store the intervals of the longest matches
        List<MatchInterval> matchIntervals = new ArrayList<>();

        for (var entry : enrichedTerms.entrySet()) {
            String matchedSubstring = entry.getKey();
            Term term = entry.getValue();

            // Find the starting and ending position of the match in the original text
            int startIndex = originalText.indexOf(matchedSubstring);
            int endIndex = startIndex + matchedSubstring.length(); // exclusive end index

            // Check if this match overlaps with any existing match interval
            boolean overlapFound = false;
            for (int i = 0; i < matchIntervals.size(); i++) {
                MatchInterval interval = matchIntervals.get(i);

                // Check if the current interval overlaps with the new match
                if ((startIndex < interval.endIndex && endIndex > interval.startIndex)) {
                    overlapFound = true;

                    // If this new match is longer, replace the current interval
                    if (matchedSubstring.length() > interval.matchedSubstring.length()) {
                        matchIntervals.set(i, new MatchInterval(startIndex, endIndex, matchedSubstring, term));
                    }

                    break;
                }
            }

            // If no overlap found, add the new match interval to the list
            if (!overlapFound) {
                matchIntervals.add(new MatchInterval(startIndex, endIndex, matchedSubstring, term));
            }
        }

        // Convert the result back to a map
        Map<String, Term> result = new HashMap<>();
        for (MatchInterval interval : matchIntervals) {
            result.put(interval.matchedSubstring, interval.term);
        }

        return result;
    }

    // Helper class to store interval details
    static class MatchInterval {
        int startIndex;
        int endIndex;
        String matchedSubstring;
        Term term;

        public MatchInterval(int startIndex, int endIndex, String matchedSubstring, Term term) {
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.matchedSubstring = matchedSubstring;
            this.term = term;
        }
    }

    // Normalize the text to handle case sensitivity and basic variations
    private String normalizeText(String text) {
        // Convert text to lowercase and trim extra spaces
        return text.toLowerCase().replaceAll("\\s+", " ");
    }

    // Check if the text contains the glossary term or its variations, and return the matched substrings from the original text
    private List<String> findMatchedStrings(String originalText, String glossaryTerm) {
        List<String> matchedStrings = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\b" + Pattern.quote(glossaryTerm) + "(s|'s|en)?\\b", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(originalText);

        while (matcher.find()) {
            // Add the exact matched substring from the original text
            matchedStrings.add(matcher.group());
        }

        return matchedStrings;
    }

    // Utility method to find a Term by the glossary term or one of its synonyms
    private Term findTermByGlossaryOrSynonym(List<Term> terms, String glossaryTerm) {
        for (Term term : terms) {
            if (term.getKeyword().equalsIgnoreCase(glossaryTerm)) {
                return term;
            }
            if (term.getSynonyms() != null && term.getSynonyms().stream().anyMatch(synonym -> synonym.equalsIgnoreCase(glossaryTerm))) {
                return term;
            }
        }
        return null;
    }

    // Get a list of all glossary terms and their synonyms
    private List<String> getAllGlossaryTermsAndSynonyms(List<Term> terms) {
        List<String> glossaryTermsAndSynonyms = new ArrayList<>();
        for (Term term : terms) {
            glossaryTermsAndSynonyms.add(term.getKeyword().toLowerCase());
            if (term.getSynonyms() != null) {
                term.getSynonyms().forEach(synonym -> glossaryTermsAndSynonyms.add(synonym.toLowerCase()));
            }
        }
        return glossaryTermsAndSynonyms;
    }

    @Transactional
    public Term getRandomGlossaryEntry() {
        long count = termRepository.countEntries();
        if (count == 0) {
            throw new IllegalStateException("No glossary entries available");
        }
        int randomIndex = new Random().nextInt((int) count);
        Pageable pageable = PageRequest.of(randomIndex, 1);
        return termRepository.findAll(pageable).getContent().get(0);
    }

    @Transactional
    public Term getRandomGlossaryEntryByCategory(Category category) {
        long count = termRepository.countEntriesByCategory(category);
        if (count == 0) {
            throw new IllegalStateException("No glossary entries available for the given category");
        }
        int randomIndex = new Random().nextInt((int) count);
        Pageable pageable = PageRequest.of(randomIndex, 1);
        return termRepository.findByCategory(category, pageable).getContent().get(0);
    }

}
