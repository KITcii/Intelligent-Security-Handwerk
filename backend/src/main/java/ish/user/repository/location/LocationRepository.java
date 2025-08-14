package ish.user.repository.location;

import ish.user.model.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long>, JpaSpecificationExecutor<Location>, LocationRepositoryCustom  {

    Optional<Location> findByPostalCode(String postalCode);
}
