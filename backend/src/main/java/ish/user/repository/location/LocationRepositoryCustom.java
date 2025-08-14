package ish.user.repository.location;

import ish.user.model.location.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

public interface LocationRepositoryCustom {

    <T> Page<T> findAllBySpecification(Specification<Location> spec, Pageable pageable, Class<T> dtoType);
}
