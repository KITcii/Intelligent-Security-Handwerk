package ish.user.repository.asset;

import ish.user.model.Company;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.SecurityControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentAssetRepository extends JpaRepository<ComponentAsset, Long> {
    List<ComponentAsset> findByCompanyId(Long companyId);

    Optional<ComponentAsset> findByCompanyAndComponent(Company company, Component component);

    //List<ComponentAsset> findAllByCompany(Company company);

    long countByCompany(Company company);

    @Query("SELECT ca FROM ComponentAsset ca " +
            "JOIN ca.component c " +
            "JOIN c.relatedControls rc " +
            "WHERE rc IN :controls AND ca.company = :company")
    List<ComponentAsset> findByCompanyAndRelatedControlsIn(Company company, List<SecurityControl> controls);

}
