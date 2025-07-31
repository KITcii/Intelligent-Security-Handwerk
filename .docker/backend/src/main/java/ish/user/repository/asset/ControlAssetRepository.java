package ish.user.repository.asset;

import ish.user.model.Company;
import ish.user.model.asset.ControlAsset;
import ish.user.model.knowledge.SecurityControl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ControlAssetRepository extends JpaRepository<ControlAsset, Long> {
    List<ControlAsset> findByCompanyId(Long companyId);

    Optional<ControlAsset> findByCompanyAndControl(Company company, SecurityControl control);

    List<ControlAsset> findByCompanyAndControlIn(Company company, List<SecurityControl> controls);

    //Gets count of control assets (implemented or in the process) relating to any control of given list within company
    @Query("SELECT COUNT(ca) FROM ControlAsset ca WHERE ca.company = :company AND ca.control IN :controls AND ca.status IN (ish.user.model.asset.ControlStatus.IN_PROCESS, ish.user.model.asset.ControlStatus.IMPLEMENTED)")
    long countByCompanyAndControlInWithStatusInProcessOrImplemented(Company company, List<SecurityControl> controls);

    // Gets count of controls that are implemented (or in the process)
    @Query("SELECT COUNT(ca) FROM ControlAsset ca WHERE ca.company = :company AND ca.status IN (ish.user.model.asset.ControlStatus.IN_PROCESS, ish.user.model.asset.ControlStatus.IMPLEMENTED)")
    long countByCompanyAndStatusInProcessOrImplemented(Company company);

    // Gets count of how often the control was implemented (or is in the process) in all companies
    @Query("SELECT COUNT(ca) FROM ControlAsset ca WHERE ca.control = :control AND ca.status IN (ish.user.model.asset.ControlStatus.IN_PROCESS, ish.user.model.asset.ControlStatus.IMPLEMENTED)")
    long countByControlWithStatusInProcessOrImplemented(SecurityControl control);

    // Gets count of new recommendations with status OPEN
    @Query("SELECT COUNT(ca) FROM ControlAsset ca WHERE ca.company = :company AND ca.status = 'OPEN' AND ca.recommended = true")
    long countByCompanyAndStatusOpenAndRecommended(Company company);

    // Retrieve control assets where status is OPEN and recommended is true
    @Query("SELECT ca FROM ControlAsset ca WHERE ca.company = :company AND ca.status = 'OPEN' AND ca.recommended = true")
    List<ControlAsset> findByCompanyAndStatusOpenAndRecommended(Company company);

    // Retrieve control assets with pagination where status is OPEN and recommended is true
    @Query("SELECT ca FROM ControlAsset ca WHERE ca.company = :company AND ca.recommended = true")
    Page<ControlAsset> findByCompanyAndRecommended(Company company, Pageable pageable);

    // Gets control assets of new recommendations
    @Query("SELECT ca FROM ControlAsset ca WHERE ca.company = :company AND ca.recommended = true")
    List<ControlAsset> findByCompanyAndRecommended(Company company);
}
