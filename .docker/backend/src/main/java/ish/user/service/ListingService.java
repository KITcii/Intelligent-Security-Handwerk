package ish.user.service;

import ish.user.dto.support.EducationSearchCriteria;
import ish.user.model.support.Listing;
import ish.user.model.support.ListingSpecifications;
import ish.user.repository.ListingRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

@Service
//@AllArgsConstructor(onConstructor_={@Autowired})
@AllArgsConstructor
public class ListingService {

    private ListingRepository listingRepository;

    public List<Listing> findbyIds(List<Long> ids) {
        return listingRepository.findAllById(ids);
    }

    public Page<Listing> findByCriteria(EducationSearchCriteria searchCriteria, Pageable pageable) {
        Specification<Listing> spec = criteriaToSpecification(searchCriteria);
        return listingRepository.findAll(spec, pageable);
    }

    public List<Listing> findByCriteria(EducationSearchCriteria searchCriteria) {
        Specification<Listing> spec = criteriaToSpecification(searchCriteria);
        return listingRepository.findAll(spec);
    }

    public Specification<Listing> criteriaToSpecification(EducationSearchCriteria criteria) {
        Specification<Listing> spec = Specification.where(null);

        if (!CollectionUtils.isEmpty(criteria.getWebsitesLike()))
            spec = spec.and(ListingSpecifications.hasWebsitesLike(criteria.getWebsitesLike()));
        else if (StringUtils.hasLength(criteria.getWebsiteLike()))
            spec = spec.and(ListingSpecifications.hasWebsiteLike(criteria.getWebsiteLike()));

        if (!CollectionUtils.isEmpty(criteria.getProviderNames()))
            spec = spec.and(ListingSpecifications.hasProviderNames(criteria.getProviderNames()));
        else if (!CollectionUtils.isEmpty(criteria.getProviderNamesLike()))
            spec = spec.and(ListingSpecifications.hasProviderNamesLike(criteria.getProviderNamesLike()));
        else if (StringUtils.hasLength(criteria.getProviderNameLike()))
            spec = spec.and(ListingSpecifications.hasProviderNameLike(criteria.getProviderNameLike()));

        if (!CollectionUtils.isEmpty(criteria.getOfferNames()))
            spec = spec.and(ListingSpecifications.hasOfferNames(criteria.getOfferNames()));
        else if (StringUtils.hasLength(criteria.getOfferNameLike()))
            spec = spec.and(ListingSpecifications.hasOfferNameLike(criteria.getOfferNameLike()));

        if (Objects.nonNull(criteria.getOfferType()))
            spec = spec.and(ListingSpecifications.hasOfferType(criteria.getOfferType()));

        if (!CollectionUtils.isEmpty(criteria.getTopicNamesLike()))
            spec = spec.and(ListingSpecifications.hasTopicNamesLike(criteria.getTopicNamesLike()));
        else if (StringUtils.hasLength(criteria.getTopicNameLike()))
            spec = spec.and(ListingSpecifications.hasTopicNameLike(criteria.getTopicNameLike()));

        if (!CollectionUtils.isEmpty(criteria.getTopicDescriptionsLike()))
            spec = spec.and(ListingSpecifications.hasTopicDescriptionsLike(criteria.getTopicDescriptionsLike()));
        else if (StringUtils.hasLength(criteria.getTopicDescriptionLike()))
            spec = spec.and(ListingSpecifications.hasTopicDescriptionLike(criteria.getTopicDescriptionLike()));

        if (!CollectionUtils.isEmpty(criteria.getOfferDescriptionsLike()))
            spec = spec.and(ListingSpecifications.hasOfferDescriptionsLike(criteria.getOfferDescriptionsLike()));
        else if (StringUtils.hasLength(criteria.getOfferDescriptionLike()))
            spec = spec.and(ListingSpecifications.hasOfferDescriptionLike(criteria.getOfferDescriptionLike()));

        return spec;
    }
}
