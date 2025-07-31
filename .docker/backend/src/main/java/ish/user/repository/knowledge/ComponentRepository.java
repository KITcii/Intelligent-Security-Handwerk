package ish.user.repository.knowledge;

import ish.user.model.knowledge.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentRepository extends JpaRepository<Component, Long>, JpaSpecificationExecutor<Component> {

    @Query("SELECT c FROM Component c WHERE c.parent IS NULL")
    List<Component> findRootComponents();
}
