package ish.user.repository.asset;

import ish.user.model.Company;
import ish.user.model.asset.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByCompany(Company company);
    List<Tag> findByCompanyId(Long companyId);

    Optional<Tag> findByNameAndCompany(String name, Company company);

    Optional<Tag> findByNameAndCompanyId(String name, Long companyId);
}
