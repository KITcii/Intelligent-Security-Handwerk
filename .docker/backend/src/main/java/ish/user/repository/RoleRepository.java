package ish.user.repository;

import ish.user.model.Role;
import ish.user.model.RoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByLabel(RoleId name);

    List<Role> findByLabelIn(List<RoleId> names);
}