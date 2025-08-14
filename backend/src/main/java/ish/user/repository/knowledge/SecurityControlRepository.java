package ish.user.repository.knowledge;

import ish.user.model.knowledge.SecurityControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityControlRepository extends JpaRepository<SecurityControl, Long>, JpaSpecificationExecutor<SecurityControl> {

    // Retrieve all root nodes (controls without a parent)

    @Query("SELECT sc FROM SecurityControl sc WHERE sc.parent IS NULL")
    List<SecurityControl> findRootControls();

    @Query("SELECT COUNT(sc) FROM SecurityControl sc WHERE sc.children IS EMPTY")
    long countLeafControls();

}
