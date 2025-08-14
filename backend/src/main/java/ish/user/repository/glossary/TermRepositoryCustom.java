package ish.user.repository.glossary;

import ish.user.model.glossary.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface TermRepositoryCustom {
    <T> Page<T> findAllBySpecification(Specification<Term> spec, Pageable pageable, Class<T> dtoType);
}