package ish.user.service.knowledge;

import ish.user.dto.asset.ControlAssetSearchCriteria;
import ish.user.dto.knowledge.ComponentSearchCriteria;
import ish.user.dto.knowledge.ControlSearchCriteria;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.ComponentSpecifications;
import ish.user.model.knowledge.ControlSpecifications;
import ish.user.model.knowledge.SecurityControl;
import ish.user.repository.knowledge.SecurityControlRepository;
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

@Service
@AllArgsConstructor
public class SecurityControlService {

    private SecurityControlRepository repository;

    public Page<SecurityControl> findByCriteria(ControlAssetSearchCriteria searchCriteria, Pageable pageable) {
        Specification<SecurityControl> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec, pageable);
    }

    public Page<SecurityControl> findByCriteria(ControlSearchCriteria searchCriteria, Pageable pageable) {
        Specification<SecurityControl> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec, pageable);
    }

    public List<SecurityControl> findByCriteria(ControlSearchCriteria searchCriteria) {
        Specification<SecurityControl> spec = criteriaToSpecification(searchCriteria);
        return repository.findAll(spec);
    }

    @Cacheable("securityControlRoots") // for methods that change controls use: @CacheEvict(value = "securityControlTrees", allEntries = true)
    public List<SecurityControl> getRootControls() {
        return repository.findRootControls();
    }

    @Cacheable("securityControlTrees")
    public List<SecurityControl> getControlTrees() {
        List<SecurityControl> roots = getRootControls();

        // Initialize the hierarchy for each root node
        roots.forEach(this::initializeChildren);
        return roots;
    }

    public SecurityControl getControl(long id) throws IllegalArgumentException {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Security control not found for ID: " + id));
    }

    public List<SecurityControl> getControls(List<Long> ids) {
        return repository.findAllById(ids);
    }

    private void initializeChildren(SecurityControl node) {
        if (node.getChildren() != null) {
            node.getChildren().forEach(this::initializeChildren);
        }
    }

    private Specification<SecurityControl> criteriaToSpecification(ControlSearchCriteria criteria) {
        Specification<SecurityControl> spec = Specification.where(null);

        if (StringUtils.hasLength(criteria.getNameLike()))
            spec = spec.and(ControlSpecifications.hasNameLike(criteria.getNameLike()));

        if (StringUtils.hasLength(criteria.getDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasDescriptionLike(criteria.getDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLongDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasLongDescriptionLike(criteria.getLongDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLabelLike()))
            spec = spec.and(ControlSpecifications.hasLabelLike(criteria.getLabelLike()));

        if (Objects.nonNull(criteria.getControlType()))
            spec = spec.and(ControlSpecifications.hasControlType(criteria.getControlType()));

        if (Objects.nonNull(criteria.getControlLevel()))
            spec = spec.and(ControlSpecifications.hasControlLevel(criteria.getControlLevel()));

        if (StringUtils.hasLength(criteria.getGuidelineDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasGuidelineDescriptionLike(criteria.getGuidelineDescriptionLike()));

        if (StringUtils.hasLength(criteria.getAll())) {
            String parameter = criteria.getAll();
            Specification<SecurityControl> all = ControlSpecifications.hasNameLike(parameter)
                    .or(ControlSpecifications.hasDescriptionLike(parameter))
                    .or(ControlSpecifications.hasLongDescriptionLike(parameter))
                    .or(ControlSpecifications.hasLabelLike(parameter))
                    .or(ControlSpecifications.hasGuidelineDescriptionLike(parameter));
            spec = spec.and(all);
        }

        return spec;
    }

    private Specification<SecurityControl> criteriaToSpecification(ControlAssetSearchCriteria criteria) {
        Specification<SecurityControl> spec = Specification.where(null);

        if (StringUtils.hasLength(criteria.getNameLike()))
            spec = spec.and(ControlSpecifications.hasNameLike(criteria.getNameLike()));

        if (StringUtils.hasLength(criteria.getDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasDescriptionLike(criteria.getDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLongDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasLongDescriptionLike(criteria.getLongDescriptionLike()));

        if (StringUtils.hasLength(criteria.getLabelLike()))
            spec = spec.and(ControlSpecifications.hasLabelLike(criteria.getLabelLike()));

        if (Objects.nonNull(criteria.getControlType()))
            spec = spec.and(ControlSpecifications.hasControlType(criteria.getControlType()));

        if (Objects.nonNull(criteria.getControlLevel()))
            spec = spec.and(ControlSpecifications.hasControlLevel(criteria.getControlLevel()));

        if (StringUtils.hasLength(criteria.getGuidelineDescriptionLike()))
            spec = spec.and(ControlSpecifications.hasGuidelineDescriptionLike(criteria.getGuidelineDescriptionLike()));

        if (!CollectionUtils.isEmpty(criteria.getStatusSet()))
            spec = spec.and(ControlSpecifications.hasAnyStatus(criteria.getStatusSet()));
        else if (Objects.nonNull(criteria.getStatus()))
            spec = spec.and(ControlSpecifications.hasStatus(criteria.getStatus()));

        if (Objects.nonNull(criteria.getInstantiated()))
            spec = spec.and(ControlSpecifications.hasAsset(criteria.getInstantiated()));

        if (StringUtils.hasLength(criteria.getAll())) {
            String parameter = criteria.getAll();
            Specification<SecurityControl> all = ControlSpecifications.hasNameLike(parameter)
                    .or(ControlSpecifications.hasDescriptionLike(parameter))
                    .or(ControlSpecifications.hasLongDescriptionLike(parameter))
                    .or(ControlSpecifications.hasLabelLike(parameter))
                    .or(ControlSpecifications.hasGuidelineDescriptionLike(parameter));
            spec = spec.and(all);
        }

        spec = addCompanyBoundary(spec, criteria);
        return spec;
    }

    private Specification<SecurityControl> addCompanyBoundary(Specification<SecurityControl> spec, ControlAssetSearchCriteria criteria) {
        List<Object> companyRelated = Arrays.asList(criteria.getStatus(), criteria.getInstantiated());

        if (companyRelated.stream().anyMatch(Objects::nonNull)) {
            if (Objects.nonNull(criteria.getCompany()))
                return spec.and(ControlSpecifications.hasCompany(criteria.getCompany()));
            else
                throw new IllegalStateException("Company cannot be null when company-related criteria are searched");
        }

        return spec;
    }
}
