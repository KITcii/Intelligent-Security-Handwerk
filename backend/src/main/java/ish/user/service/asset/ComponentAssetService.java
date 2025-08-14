package ish.user.service.asset;

import ish.user.model.Company;
import ish.user.model.asset.*;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.SecurityControl;
import ish.user.repository.asset.AliasRepository;
import ish.user.repository.asset.ComponentAliasRepository;
import ish.user.repository.asset.ComponentAssetRepository;
import ish.user.repository.asset.TagRepository;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@CommonsLog
@Service
@AllArgsConstructor
public class ComponentAssetService {

    private ComponentAssetRepository componentAssetRepository;
    private AliasRepository aliasRepository;
    private ComponentAliasRepository componentAliasRepository;
    private TagRepository tagRepository;
    private ControlAssetService controlAssetService;

    public List<ComponentAsset> findByCompany(Company company) {
        return componentAssetRepository.findByCompanyId(company.getId());
    }

    public long countAssets(Company company) {
        return componentAssetRepository.countByCompany(company);
    }

    public Optional<ComponentAsset> findByCompanyAndComponent(Company company, Component component) {
        return componentAssetRepository.findByCompanyAndComponent(company, component);
    }

    public List<ComponentAsset> findByCompanyAndRelatedControls(Company company, List<SecurityControl> controls) {
        return componentAssetRepository.findByCompanyAndRelatedControlsIn(company, controls);
    }

    @Transactional
    public void deleteComponentAsset(ComponentAsset asset) {
        var controls = asset.getComponent().getRelatedControls();

        componentAssetRepository.deleteById(asset.getId());
        if (!controls.isEmpty()) {
            // TODO fix after data is patched
            // necessary because often the parents are mapped instead of single controls
            controls = controls.stream().map(SecurityControl::getChildren).flatMap(List::stream).toList();
            List<ControlAsset> controlAssets = controlAssetService.findByCompanyAndControls(asset.getCompany(), controls);

            List<ControlAsset>  implementedAssets = controlAssets.stream().filter(ca -> ca.isRecommended() && (ca.getStatus() == ControlStatus.IN_PROCESS || ca.getStatus() == ControlStatus.IMPLEMENTED)).toList();
            implementedAssets.forEach(ca -> ca.setRecommended(false));
            controlAssetService.updateControllAssets(implementedAssets);
            // TODO only delete controls that are not associated with other component assets

            List<ControlAsset>  recommendationAssets = controlAssets.stream().filter(ca -> ca.isRecommended() && (ca.getStatus() == ControlStatus.OPEN || ca.getStatus() == ControlStatus.IRRELEVANT)).toList();
            controlAssetService.deleteControlAssets(recommendationAssets);
        }
    }

    @Transactional
    public ComponentAsset addComponentAsset(Company company, Component component) {
        ComponentAsset asset = new ComponentAsset();
        asset.setCompany(company);
        asset.setComponent(component);
        asset = componentAssetRepository.save(asset);

        var controls = component.getRelatedControls();
        // TODO fix after data is patched
        // necessary because often the parents are mapped instead of single controls
        controls = controls.stream().map(SecurityControl::getChildren).flatMap(List::stream).collect(Collectors.toCollection(ArrayList::new));

        List<ControlAsset> controlAssets = controlAssetService.findByCompanyAndControls(asset.getCompany(), controls);
        List<Long> implementedControlIDs = controlAssets.stream()
                //lter(ca -> ca.isRecommended() && (ca.getStatus() == ControlStatus.IN_PROCESS || ca.getStatus() == ControlStatus.IMPLEMENTED))
                .map(ControlAsset::getReferenceId)
                .toList();
        controls.removeIf(c -> implementedControlIDs.contains(c.getId()));

        if (!controls.isEmpty())
            controlAssetService.addRecommendations(company, controls);

        return asset;
    }

    public ComponentAsset addAlias(ComponentAsset asset, String alias)  {
        Company company = asset.getCompany();

        Optional<Alias> a = aliasRepository.findByNameAndCompanyId(alias, company.getId());
        Alias managedAlias;
        if (a.isEmpty()) {
            managedAlias = new Alias();
            managedAlias.setName(alias);
            managedAlias.setCompany(company);
            managedAlias = aliasRepository.save(managedAlias);
        } else
            managedAlias = a.get();

        ComponentAlias componentAlias = new ComponentAlias();
        componentAlias.setComponentAsset(asset);
        componentAlias.setAlias(managedAlias);

        List<ComponentAlias> aliases = asset.getAliases();
        Alias finalManagedAlias = managedAlias;
        if (aliases.stream().noneMatch(ca -> ca.getAlias().equals(finalManagedAlias)))
            aliases.add(componentAlias);
        else
            throw new IllegalArgumentException("Component already had alias: " + alias);

        return componentAssetRepository.save(asset);
    }

    public ComponentAsset removeAlias(ComponentAsset asset, Alias alias) {
        if (asset.getAliases().stream().noneMatch(componentAlias -> componentAlias.getAlias().equals(alias))) {
            throw new IllegalArgumentException("Alias is not associated with the given asset");
        }

        asset.getAliases().removeIf(componentAlias -> componentAlias.getAlias().equals(alias));
        componentAssetRepository.save(asset);
        return asset;
    }

    public ComponentAsset renameAlias(ComponentAlias alias, String newAlias)  {
        ComponentAsset asset = alias.getComponentAsset();
        Company company = asset.getCompany();

        Optional<Alias> a = aliasRepository.findByNameAndCompanyId(newAlias, company.getId());
        Alias managedAlias;
        if (a.isEmpty()) {
            managedAlias = new Alias();
            managedAlias.setName(newAlias);
            managedAlias.setCompany(company);
            managedAlias = aliasRepository.save(managedAlias);
        } else
            managedAlias = a.get();

        if (componentAliasRepository.existsByComponentAssetAndAlias(asset, managedAlias))
            throw new IllegalArgumentException("Can't rename into already existing alias");

        alias.setAlias(managedAlias);
        return componentAssetRepository.save(asset);
    }

    public ComponentAsset addTag(ComponentAlias alias, String tag) {
        return manageTag(alias, tag, false);
    }

    public ComponentAsset removeTag(ComponentAlias alias, String tag) {
        return manageTag(alias, tag, true);
    }

    private ComponentAsset manageTag(ComponentAlias alias, String tag, boolean remove) {
        ComponentAsset asset = alias.getComponentAsset();
        Company company = asset.getCompany();

        Optional<Tag> tag_ = tagRepository.findByNameAndCompanyId(tag, company.getId());

        Tag managedTag;
        if (tag_.isEmpty()) {
            managedTag = new Tag();
            managedTag.setName(tag);
            managedTag.setCompany(company);
            managedTag = tagRepository.save(managedTag);
        } else
            managedTag = tag_.get();

        List<Tag> tags = alias.getTags();
        if (remove && !tags.contains(managedTag))
            throw new IllegalArgumentException("Alias does not have tag: " + tag);

        if (!remove && tags.contains(managedTag))
            throw new IllegalArgumentException("Alias already has tag: " + tag);

        if (remove)
            tags.remove(managedTag);
        else
            tags.add(managedTag);

        return componentAssetRepository.save(asset);
    }
}
