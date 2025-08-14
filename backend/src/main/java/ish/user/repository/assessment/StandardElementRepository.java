package ish.user.repository.assessment;

import ish.user.model.assessment.StandardElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StandardElementRepository extends JpaRepository<StandardElement, Long> {

    @Query("SELECT se FROM StandardElement se WHERE se.parent IS NULL")
    List<StandardElement> findRootElements();
}
