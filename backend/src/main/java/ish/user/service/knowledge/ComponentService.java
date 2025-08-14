package ish.user.service.knowledge;

import ish.user.dto.asset.ComponentAssetSearchCriteria;
import ish.user.dto.knowledge.ComponentSearchCriteria;
import ish.user.model.Company;
import ish.user.model.glossary.Term;
import ish.user.model.glossary.TermSpecifications;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.ComponentSpecifications;
import ish.user.model.knowledge.ControlSpecifications;
import ish.user.repository.knowledge.ComponentRepository;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ComponentService {

    private ComponentRepository repository;

    public Page<Component> findByCriteria(ComponentAssetSearchCriteria searchCriteria, Pageable pageable) {
        Specification<Component> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec, pageable);
    }

    public Page<Component> findByCriteria(ComponentSearchCriteria searchCriteria, Pageable pageable) {
        Specification<Component> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec, pageable);
    }

    public List<Component> findByCriteria(ComponentSearchCriteria searchCriteria) {
        Specification<Component> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec);
    }

    @Cacheable("componentRoots") // for methods that change controls use: @CacheEvict(value = "securityControlTrees", allEntries = true)
    public List<Component> getRootComponents() {
        return repository.findRootComponents();
    }

    public Component getComponent(long id) throws IllegalArgumentException {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Component not found for ID: " + id));
    }

    public List<Component> getComponents(List<Long> ids) {
        return repository.findAllById(ids);
    }

    private Specification<Component> criteriaToSpecification(ComponentSearchCriteria criteria) {
        Specification<Component> spec = Specification.where(null);

        if (StringUtils.hasLength(criteria.getNameLike()))
            spec = spec.and(ComponentSpecifications.hasNameLike(criteria.getNameLike()));

        if (StringUtils.hasLength(criteria.getDescriptionLike()))
            spec = spec.and(ComponentSpecifications.hasDescriptionLike(criteria.getDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLongDescriptionLike()))
            spec = spec.and(ComponentSpecifications.hasLongDescriptionLike(criteria.getLongDescriptionLike()));

        if (StringUtils.hasLength(criteria.getAll())) {
            String parameter = criteria.getAll();
            Specification<Component> all = ComponentSpecifications.hasNameLike(parameter)
                    .or(ComponentSpecifications.hasDescriptionLike(parameter))
                    .or(ComponentSpecifications.hasLongDescriptionLike(parameter));
            spec = spec.and(all);
        }

        return spec;
    }

    private Specification<Component> criteriaToSpecification(ComponentAssetSearchCriteria criteria) {
        Specification<Component> spec = Specification.where(null);

        if (StringUtils.hasLength(criteria.getNameLike()))
            spec = spec.and(ComponentSpecifications.hasNameLike(criteria.getNameLike()));

        if (StringUtils.hasLength(criteria.getDescriptionLike()))
            spec = spec.and(ComponentSpecifications.hasDescriptionLike(criteria.getDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLongDescriptionLike()))
            spec = spec.and(ComponentSpecifications.hasLongDescriptionLike(criteria.getLongDescriptionLike()));

        if (StringUtils.hasLength(criteria.getAlias()))
            spec = spec.and(ComponentSpecifications.hasAlias(criteria.getAlias()));

        if (!CollectionUtils.isEmpty(criteria.getAliases()))
            spec = spec.and(ComponentSpecifications.hasAlias(criteria.getAliases()));

        if (StringUtils.hasLength(criteria.getTag()))
            spec = spec.and(ComponentSpecifications.hasTag(criteria.getTag()));

        if (!CollectionUtils.isEmpty(criteria.getTags()))
            spec = spec.and(ComponentSpecifications.hasTag(criteria.getTags()));

        if (Objects.nonNull(criteria.getInstantiated()))
            spec = spec.and(ComponentSpecifications.hasAsset(criteria.getInstantiated()));

        if (StringUtils.hasLength(criteria.getAll())) {
            String parameter = criteria.getAll();
            Specification<Component> all = ComponentSpecifications.hasNameLike(parameter)
                    .or(ComponentSpecifications.hasDescriptionLike(parameter))
                    .or(ComponentSpecifications.hasLongDescriptionLike(parameter));
            spec = spec.and(all);
        }

        spec = addCompanyBoundary(spec, criteria);
        return spec;
    }

    private Specification<Component> addCompanyBoundary(Specification<Component> spec, ComponentAssetSearchCriteria criteria) {
        List<Object> companyRelated = Arrays.asList(criteria.getAlias(), criteria.getAliases(), criteria.getTag(), criteria.getTags(), criteria.getInstantiated());

        if (companyRelated.stream().anyMatch(Objects::nonNull)) {
            if (Objects.nonNull(criteria.getCompany()))
                return spec.and(ComponentSpecifications.hasCompany(criteria.getCompany()));
            else
                throw new IllegalStateException("Company cannot be null when company-related criteria are searched");
        }

        return spec;
    }
}
