package ish.user.service;

import ish.user.dto.location.LocationDTO;
import ish.user.dto.location.LocationSearchCriteria;
import ish.user.model.location.Location;
import ish.user.model.location.LocationSpecifications;
import ish.user.repository.location.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class LocationService {

    private LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Page<LocationDTO> findLightByCriteria(LocationSearchCriteria searchCriteria, Pageable pageable) {
        Specification<Location> spec = criteriaToSpecification(searchCriteria);
        return locationRepository.findAllBySpecification(spec, pageable, LocationDTO.class);
    }

    public Page<Location> findByCriteria(LocationSearchCriteria searchCriteria, Pageable pageable) {
        Specification<Location> spec = criteriaToSpecification(searchCriteria);
        return locationRepository.findAll(spec, pageable);
    }

    public List<Location> findByCriteria(LocationSearchCriteria searchCriteria) {
        Specification<Location> spec = criteriaToSpecification(searchCriteria);
        return locationRepository.findAll(spec);
    }

    private Specification<Location> criteriaToSpecification(LocationSearchCriteria searchCriteria) {
        Specification<Location> spec = Specification.where(null);

        if (StringUtils.hasLength(searchCriteria.getPostalCode()))
            spec = spec.and(LocationSpecifications.hasPostalCodeLike(searchCriteria.getPostalCode()));

        if (StringUtils.hasLength(searchCriteria.getTown()))
            spec = spec.and(LocationSpecifications.hasNameLike(searchCriteria.getTown()));

        if (StringUtils.hasLength(searchCriteria.getAll())) {
            Specification<Location> all = LocationSpecifications.hasPostalCodeLike(searchCriteria.getAll())
                    .or(LocationSpecifications.hasNameLike(searchCriteria.getAll()));
            spec = spec.and(all);
        }

        return spec;
    }
}
