package ish.user.model.knowledge;

import ish.user.model.Company;
import ish.user.model.asset.ComponentAlias;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.asset.Tag;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ComponentSpecifications {

    public static Specification<Component> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Component> hasDescriptionLike(String description) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%");
        };
    }

    public static Specification<Component> hasLongDescriptionLike(String longDescription) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("longDescription")), "%" + longDescription.toLowerCase() + "%");
        };
    }

    public static Specification<Component> hasCompany(Company company) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);

            subquery.select(componentAssetRoot.get("component").get("id"))
                    .where(criteriaBuilder.equal(componentAssetRoot.get("company").get("id"), company.getId()));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<Component> hasAlias(String aliasName) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            // Create a subquery to check if the alias exists for the given component
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);
            Join<ComponentAsset, ComponentAlias> aliasJoin = componentAssetRoot.join("aliases", JoinType.INNER);

            subquery.select(componentAssetRoot.get("component").get("id")) // Select component IDs
                    .where(criteriaBuilder.equal(aliasJoin.get("alias").get("name"), aliasName));

            return criteriaBuilder.in(root.get("id")).value(subquery); // Match components by ID
        };
    }

    public static Specification<Component> hasAlias(List<String> aliases) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);
            Join<ComponentAsset, ComponentAlias> aliasJoin = componentAssetRoot.join("aliases", JoinType.INNER);

            subquery.select(componentAssetRoot.get("component").get("id"))
                    .where(aliasJoin.get("alias").get("name").in(aliases));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<Component> hasTag(String tagName) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);
            Join<ComponentAsset, ComponentAlias> aliasJoin = componentAssetRoot.join("aliases", JoinType.INNER);
            Join<ComponentAlias, Tag> tagJoin = aliasJoin.join("tags", JoinType.INNER);

            subquery.select(componentAssetRoot.get("component").get("id"))
                    .where(criteriaBuilder.equal(tagJoin.get("name"), tagName));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }

    public static Specification<Component> hasTag(List<String> tags) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);
            Join<ComponentAsset, ComponentAlias> aliasJoin = componentAssetRoot.join("aliases", JoinType.INNER);
            Join<ComponentAlias, Tag> tagJoin = aliasJoin.join("tags", JoinType.INNER);

            subquery.select(componentAssetRoot.get("component").get("id"))
                    .where(tagJoin.get("name").in(tags));

            return criteriaBuilder.in(root.get("id")).value(subquery);
        };
    }
    public static Specification<Component> hasAsset(Boolean hasAsset) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> componentAssetRoot = subquery.from(ComponentAsset.class);
            subquery.select(componentAssetRoot.get("component").get("id"));

            return hasAsset
                    ? criteriaBuilder.in(root.get("id")).value(subquery)
                    : criteriaBuilder.not(criteriaBuilder.in(root.get("id")).value(subquery));
        };
    }

    /*
    public static Specification<Component> hasAsset(boolean exists) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ComponentAsset> assetRoot = subquery.from(ComponentAsset.class);
            subquery.select(assetRoot.get("id"))
                    .where(criteriaBuilder.equal(assetRoot.get("component"), root));
            return exists
                    ? criteriaBuilder.exists(subquery)
                    : criteriaBuilder.not(criteriaBuilder.exists(subquery));
        };
    }

     */

}
