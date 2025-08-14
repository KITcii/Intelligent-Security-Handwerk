package ish.user.service.asset;

import ish.user.model.Company;
import ish.user.model.asset.ControlAsset;
import ish.user.model.asset.ControlStatus;
import ish.user.model.asset.GuidelineAsset;
import ish.user.model.knowledge.ControlGuideline;
import ish.user.model.knowledge.SecurityControl;
import ish.user.repository.asset.ControlAssetRepository;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.naming.ldap.Control;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CommonsLog
@Service
@AllArgsConstructor
public class ControlAssetService {

    private ControlAssetRepository controlAssetRepository;

    public List<ControlAsset> findByCompany(Company company) {
        return controlAssetRepository.findByCompanyId(company.getId());
    }

    public long countControls(Company company) {
        return controlAssetRepository.countByCompanyAndStatusInProcessOrImplemented(company);
    }

    public long countControlsOf(Company company, List<SecurityControl> controls) {
        return controlAssetRepository.countByCompanyAndControlInWithStatusInProcessOrImplemented(company, controls);
    }

    public long countCompanies(SecurityControl control) {
        return controlAssetRepository.countByControlWithStatusInProcessOrImplemented(control);
    }

    public long countRecommendedControls(Company company) {
        return controlAssetRepository.countByCompanyAndStatusOpenAndRecommended(company);
    }

    public List<ControlAsset> findRecommendedControls(Company company) {
        return controlAssetRepository.findByCompanyAndRecommended(company);
    }

    public Page<ControlAsset> findRecommendedControls(Company company, Pageable pageable) {
        return controlAssetRepository.findByCompanyAndRecommended(company, pageable);
    }

    public Optional<ControlAsset> findByCompanyAndControl(Company company, SecurityControl control) {
        return controlAssetRepository.findByCompanyAndControl(company, control);
    }

    public List<ControlAsset> findByCompanyAndControls(Company company, List<SecurityControl> controls) {
        return controlAssetRepository.findByCompanyAndControlIn(company, controls);
    }

    public void deleteControlAssets(ControlAsset asset) {
        controlAssetRepository.deleteById(asset.getId());
    }

    public void deleteControlAssets(List<ControlAsset> assets) {
        controlAssetRepository.deleteAll(assets);
    }

    public ControlAsset addControlAsset(Company company, SecurityControl control) {
        ControlAsset asset = new ControlAsset();
        asset.setCompany(company);
        asset.setControl(control);
        asset.setStatus(ControlStatus.IN_PROCESS);
        return controlAssetRepository.save(asset);
    }

    public void addRecommendations(Company company, List<SecurityControl> controls) {
        List<ControlAsset> assets = new ArrayList<>();

        for (var control : controls) {
            ControlAsset asset = new ControlAsset();
            asset.setCompany(company);
            asset.setControl(control);
            asset.setStatus(ControlStatus.OPEN);
            asset.setRecommended(true);

            assets.add(asset);
        }

        controlAssetRepository.saveAll(assets);
    }

    public ControlAsset flipRelevance(ControlAsset ca) {
        if (ca.getStatus() == ControlStatus.IRRELEVANT) {
            ca.setStatus(ControlStatus.OPEN);
        } else {
            ca.setStatus(ControlStatus.IRRELEVANT);
            ca.getImplementedGuidelines().clear();
        }
        return controlAssetRepository.save(ca);
    }

    public List<ControlAsset> updateControllAssets(List<ControlAsset> assets) {
        return controlAssetRepository.saveAll(assets);
    }

    public ControlAsset updateControlAsset(ControlAsset asset, List<ControlGuideline> implemented) {
        SecurityControl control = asset.getControl();

        if (implemented.isEmpty() || new HashSet<>(control.getGuidelines()).containsAll(implemented)) {
            var uniqueImplemented = new HashSet<>(implemented);
            List<GuidelineAsset> mapped = uniqueImplemented.stream().map(guideline -> GuidelineAsset.from(asset, guideline)).collect(Collectors.toCollection(ArrayList::new));

            // when Hibernate uses orphanRemoval, it expects the collection to remain consistent and does not allow the reference to be replaced
            asset.getImplementedGuidelines().clear();
            asset.getImplementedGuidelines().addAll(mapped);

            if (uniqueImplemented.size() == control.getGuidelines().size())
                asset.setStatus(ControlStatus.IMPLEMENTED);
            else
                asset.setStatus(ControlStatus.IN_PROCESS);
        } else
            throw new IllegalArgumentException("Given implemented guidelines are not part of control: " + control.getName());

        return controlAssetRepository.save(asset);
    }
}
