package ish.user.repository.asset;

import ish.user.model.Company;
import ish.user.model.asset.Alias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AliasRepository extends JpaRepository<Alias, Long> {

    List<Alias> findByCompany(Company company);

    List<Alias> findByCompanyId(Long companyId);

    Optional<Alias> findByNameAndCompany(String name, Company company);

    Optional<Alias> findByNameAndCompanyId(String name, Long companyId);
}
