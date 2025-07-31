package ish.user.repository.glossary;

import ish.user.model.glossary.Category;
import ish.user.model.glossary.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermRepository extends JpaRepository<Term, Long>, JpaSpecificationExecutor<Term>, TermRepositoryCustom {

    // Find term by id
    @Override
    Optional<Term> findById(Long id);

    // Find term by keyword (exact match)
    Optional<Term> findByKeyword(String keyword);

    // Find terms that contain the given keyword in synonyms or as the term itself
    @Query("SELECT t FROM Term t WHERE t.keyword = :keyword OR :keyword MEMBER OF t.synonyms")
    List<Term> findByTermOrSynonym(String keyword);

    // Find terms that match a list of keywords, including synonyms
    @Query("SELECT t FROM Term t WHERE t.keyword IN :keywords OR EXISTS (SELECT s FROM t.synonyms s WHERE s IN :keywords)")
    List<Term> findAllByTermOrSynonymIn(List<String> keywords);

    @Query("SELECT COUNT(t) FROM Term t")
    long countEntries();

    @Query("SELECT COUNT(t) FROM Term t WHERE t.category = :category")
    long countEntriesByCategory(Category category);

    @Query("SELECT t FROM Term t WHERE t.category = :category")
    Page<Term> findByCategory(Category category, Pageable pageable);

}
