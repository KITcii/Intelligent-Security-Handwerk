package ish.user.model.support;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ListingSpecifications {

    public static Specification<Listing> hasWebsiteLike(String website) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("website")), "%" + website.toLowerCase() + "%");
        };
    }

    public static Specification<Listing> hasProviderNameLike(String providerName) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("provider").get("name")), "%" + providerName.toLowerCase() + "%");
        };
    }

    public static Specification<Listing> hasOfferNameLike(String offerName) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("offer").get("name")), "%" + offerName.toLowerCase() + "%");
        };
    }

    public static Specification<Listing> hasOfferType(OfferType offerType) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.equal(root.get("offer").get("type"), offerType);
        };
    }

    public static Specification<Listing> hasTopicNameLike(String topicName) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.join("offer").join("topics").get("name")), "%" + topicName.toLowerCase() + "%");
        };
    }

    public static Specification<Listing> hasOfferDescriptionLike(String description) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("offer").get("description")), "%" + description.toLowerCase() + "%");
        };
    }

    public static Specification<Listing> hasTopicDescriptionLike(String description) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.like(criteriaBuilder.lower(root.join("offer").join("topics").get("description")), "%" + description.toLowerCase() + "%");
        };
    }

    // exact match not needed right now
    /*
    public static Specification<Listing> hasWebsites(List<String> websites) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.lower(root.get("website")).in(websites.stream()
                    .map(String::toLowerCase)
                    .toList());
        };
    }
     */

    public static Specification<Listing> hasWebsitesLike(List<String> websites) {
        return (root, query, criteriaBuilder) -> websites
                .stream()
                .map(website -> criteriaBuilder.like(criteriaBuilder.lower(root.get("website")), "%" + website.toLowerCase() + "%"))
                .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
    }

    public static Specification<Listing> hasProviderNames(List<String> providerNames) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.lower(root.get("provider").get("name")).in(providerNames.stream()
                    .map(String::toLowerCase)
                    .toList());
        };
    }

    public static Specification<Listing> hasProviderNamesLike(List<String> providerNames) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return providerNames
                    .stream()
                    .map(provider -> criteriaBuilder.like(criteriaBuilder.lower(root.get("provider").get("name")), "%" + provider.toLowerCase() + "%"))
                    .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
        };
    }

    public static Specification<Listing> hasOfferNames(List<String> offerNames) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.lower(root.get("offer").get("name")).in(offerNames.stream()
                    .map(String::toLowerCase)
                    .toList());
        };
    }

    public static Specification<Listing> hasOfferDescriptionsLike(List<String> descriptions) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return descriptions
                    .stream()
                    .map(desc -> criteriaBuilder.like(criteriaBuilder.lower(root.get("offer").get("description")), "%" + desc.toLowerCase() + "%"))
                    .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
        };
    }

    public static Specification<Listing> hasTopicNamesLike(List<String> topicNames) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Join<Object, Object> topicsJoin = root.join("offer").join("topics");
            return topicNames
                    .stream()
                    .map(topicName -> criteriaBuilder.like(criteriaBuilder.lower(topicsJoin.get("name")), "%" + topicName.toLowerCase() + "%"))
                    .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
        };
    }

    public static Specification<Listing> hasTopicDescriptionsLike(List<String> descriptions) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Join<Object, Object> topicsJoin = root.join("offer").join("topics");
            return descriptions
                    .stream()
                    .map(desc -> criteriaBuilder.like(criteriaBuilder.lower(topicsJoin.get("description")), "%" + desc.toLowerCase() + "%"))
                    .reduce(criteriaBuilder.disjunction(), criteriaBuilder::or);
        };
    }
}
