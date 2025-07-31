package ish.user.model.glossary;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;

public class TermSpecifications {

    public static Specification<Term> hasId(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id);
    }

    public static Specification<Term> hasId(List<String> ids) {
        return (root, query, criteriaBuilder) -> root.get("id").in(ids);
    }

    public static Specification<Term> hasKeyword(String keyword) {
        //Specification spec = Specification.where(null);
        //spec.or()

        /*
        return new Specification<>() {
            @Override
            public Predicate toPredicate(Root<Term> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.or(criteriaBuilder.equal(root.get("keyword"), keyword), criteriaBuilder.equal(criteriaBuilder.lower(root.get("synonyms")), keyword.toLowerCase()));
            }
        };
         */

        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("keyword")), keyword.toLowerCase());
    }

    public static Specification<Term> hasKeywordLike(String keyword) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("keyword")), "%" + keyword.toLowerCase() + "%");
        };
    }

    // TODO change name to hasKeywords
    public static Specification<Term> hasKeyword(List<String> keywords) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lower(root.get("keyword")).in(keywords.stream().map(String::toLowerCase).toList());
    }

    public static Specification<Term> hasKeywordLike(List<String> keywords) {
        return (root, query, criteriaBuilder) -> keywords
                .stream()
                .map(keyword -> criteriaBuilder.like(criteriaBuilder.lower(root.get("keyword")), "%" + keyword.toLowerCase() + "%"))
                .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
    }

    public static Specification<Term> hasSynonymsOrKeywordLike(String word) {
        return hasSynonymsLike(word).or(hasKeywordLike(word));
    }

    public static Specification<Term> hasSynonymsOrKeywordLike(List<String> words) {
        return hasSynonymsLike(words).or(hasKeywordLike(words));
    }

    public static Specification<Term> hasSynonyms(String synonym) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isMember(synonym, root.get("synonyms"));
    }

    public static Specification<Term> hasSynonyms(List<String> synonyms) {
        return (root, query, criteriaBuilder) -> synonyms.stream().map(synonym -> criteriaBuilder.isMember(synonym, root.get("synonyms"))).reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
    }

    public static Specification<Term> hasSynonymsLike(String synonym) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.join("synonyms")), "%" + synonym.toLowerCase() + "%");
        };
    }

    public static Specification<Term> hasSynonymsLike(List<String> synonyms) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return synonyms
                .stream()
                .map(synonym -> criteriaBuilder.like(criteriaBuilder.lower(root.join("synonyms")), "%" + synonym.toLowerCase() + "%"))
                .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
        };
    }

    public static Specification<Term> hasDefinition(String definition) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("definition")), "%" + definition.toLowerCase() + "%");
        };
    }

    public static Specification<Term> hasDescription(String description) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%");
        };
    }

    /*
    public static Specification<Term> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Term> hasCategory(List<String> categories) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lower(root.get("category")).in(categories.stream().map(String::toLowerCase).toList());
    }

     */

    public static Specification<Term> hasCategory(String categoryName) {
        return (root, query, criteriaBuilder) -> {
            Join<Term, Category> categoryJoin = root.join("category");
            return criteriaBuilder.equal(criteriaBuilder.lower(categoryJoin.get("name")), categoryName.toLowerCase());
        };
    }

    public static Specification<Term> hasCategory(List<String> categoryNames) {
        return (root, query, criteriaBuilder) -> {
            Join<Term, Category> categoryJoin = root.join("category");
            return criteriaBuilder.lower(categoryJoin.get("name")).in(categoryNames.stream().map(String::toLowerCase).toList());
        };
    }
}