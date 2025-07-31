package ish.user.model.location;

import org.springframework.data.jpa.domain.Specification;

public class LocationSpecifications {

    public static Specification<Location> hasPostalCodeLike(String postalCode) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("postalCode")), postalCode.toLowerCase() + "%");
    }

    public static Specification<Location> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}
