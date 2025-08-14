package ish.user.repository.location;

import ish.user.model.location.Location;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

public class LocationRepositoryCustomImpl implements LocationRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public <T> Page<T> findAllBySpecification(Specification<Location> spec, Pageable pageable, Class<T> dtoType) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(dtoType);
        Root<Location> root = query.from(Location.class);

        // Apply specification
        if (Objects.nonNull(spec)) {
            Predicate predicate = spec.toPredicate(root, query, cb);

            if (Objects.nonNull(predicate))
                query.where(predicate);
        }

        // Apply sorting from Pageable
        if (pageable.getSort().isSorted()) {
            // different types of order, e.g. jakarta.persistence.criteria.Order and org.springframework.data.domain.Sort.Order
            List<Order> orders = pageable.getSort().stream()
                    .map(order -> order.isAscending() ? cb.asc(root.get(order.getProperty())) : cb.desc(root.get(order.getProperty())))
                    .toList();
            query.orderBy(orders);
        }

        // Project to DTO
        query.select(entityManager.getCriteriaBuilder().construct(dtoType, root.get("id"), root.get("name"), root.get("postalCode")));

        // Execute query
        TypedQuery<T> typedQuery = entityManager.createQuery(query);

        // Pagination
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        // Fetch results
        List<T> results = typedQuery.getResultList();

        // Count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Location> countRoot = countQuery.from(Location.class);
        countQuery.select(cb.count(countRoot));
        if (Objects.nonNull(spec)) {
            Predicate countPredicate = spec.toPredicate(countRoot, countQuery, cb);

            if (Objects.nonNull(countPredicate))
                countQuery.where(countPredicate);
        }

        Long total = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(results, pageable, total);
    }
}
