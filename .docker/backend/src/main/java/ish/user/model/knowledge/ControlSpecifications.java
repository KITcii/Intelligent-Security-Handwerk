package ish.user.model.knowledge;

import ish.user.model.Company;
import ish.user.model.asset.ControlAsset;
import ish.user.model.asset.ControlStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Set;

public class ControlSpecifications {

    public static Specification<SecurityControl> hasIds(List<Long> ids) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return root.get("id").in(ids);
        };
    }

    public static Specification<SecurityControl> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<SecurityControl> hasDescriptionLike(String description) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%");
        };
    }

    public static Specification<SecurityControl> hasLongDescriptionLike(String longDescription) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("longDescription")), "%" + longDescription.toLowerCase() + "%");
        };
    }

    public static Specification<SecurityControl> hasLabelLike(String label) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("label")), "%" + label.toLowerCase() + "%");
        };
    }
    public static Specification<SecurityControl> hasControlLevel(ControlLevel level) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.equal(root.get("level"), level);
        };
    }

    public static Specification<SecurityControl> hasControlType(ControlType type) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.equal(root.get("type"), type);
        };
    }

    public static Specification<SecurityControl> hasGuidelineDescriptionLike(String desc) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Join<SecurityControl, ControlGuideline> guidelinesJoin = root.join("guidelines");
            return criteriaBuilder.like(criteriaBuilder.lower(guidelinesJoin.get("description")), "%" + desc.toLowerCase() + "%"
            );
        };
    }

    public static Specification<SecurityControl> hasCompany(Company company) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ControlAsset> controlAssetRoot = subquery.from(ControlAsset.class);

            subquery.select(controlAssetRoot.get("control").get("id"))
                    .where(criteriaBuilder.equal(controlAssetRoot.get("company").get("id"), company.getId()));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<SecurityControl> hasStatus(ControlStatus status) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ControlAsset> controlAssetRoot = subquery.from(ControlAsset.class);

            subquery.select(controlAssetRoot.get("control").get("id"))
                    .where(criteriaBuilder.equal(controlAssetRoot.get("status"), status));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<SecurityControl> hasAnyStatus(Set<ControlStatus> status) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ControlAsset> controlAssetRoot = subquery.from(ControlAsset.class);

            subquery.select(controlAssetRoot.get("control").get("id"))
                    .where(controlAssetRoot.get("status").in(status)); // Check if status is in the given set

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<SecurityControl> hasAsset(Boolean hasAsset) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ControlAsset> controlAssetRoot = subquery.from(ControlAsset.class);

            subquery.select(controlAssetRoot.get("control").get("id"));

            return hasAsset
                    ? criteriaBuilder.in(root.get("id")).value(subquery)
                    : criteriaBuilder.not(criteriaBuilder.in(root.get("id")).value(subquery));
        };
    }
}
