package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.asset.*;
import ish.user.dto.knowledge.ComponentSearchCriteria;
import ish.user.dto.knowledge.ComponentSearchRequest;
import ish.user.model.Company;
import ish.user.model.User;
import ish.user.model.asset.Alias;
import ish.user.model.asset.ComponentAlias;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.knowledge.Component;
import ish.user.repository.asset.AliasRepository;
import ish.user.repository.asset.ComponentAliasRepository;
import ish.user.service.asset.ComponentAssetService;
import ish.user.service.knowledge.ComponentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/component-asset")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Asset API", description = "Asset endpoint")
@CommonsLog
@AllArgsConstructor
public class ComponentAssetController {

    private UserExtractor userExtractor;
    private ComponentService componentService;
    private ComponentAssetService componentAssetService;
    private AliasRepository aliasRepository;
    private ComponentAliasRepository componentAliasRepository;

    @Operation(summary = "Count component assets", description = "Returns number of component assets in associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully counted component assets"),
            @ApiResponse(responseCode = "500", description = "Failed to count component assets")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<?> getComponentAssetCount(
            HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        long assets = componentAssetService.countAssets(company);
        return ResponseEntity.status(HttpStatus.OK).body(assets);
    }

    @Operation(summary = "Search components by criteria", description = "Returns corresponding components with associated assets")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched components"),
            @ApiResponse(responseCode = "500", description = "Failed to search components")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search")
    public ResponseEntity<?> findComponentsWithAssetsByCriteria(
            HttpServletRequest request,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Component search information", content = {@Content(schema = @Schema(implementation = ComponentAssetSearchRequest.class), mediaType = "application/json")}, required = true)
            @RequestBody ComponentAssetSearchRequest componentSearchRequest) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        ComponentAssetSearchCriteria criteria = componentSearchRequest.getSearchCriteria();
        criteria.setCompany(company);

        Page<Component> components = componentService.findByCriteria(criteria, componentSearchRequest.getPageable().toPageable());
        List<ComponentAsset> assets = componentAssetService.findByCompany(company);

        Page<ComponentAssetNodeDTO> componentAssets = components.map(component -> AssetNodeDTO.fromComponent(component, assets));
        return ResponseEntity.status(HttpStatus.OK).body(componentAssets);
    }

    @Operation(summary = "Remove tag", description = "Removes tag from component alias in associated company")
    @Parameters({
            @Parameter(name = "instanceId", description = "ID that corresponds to component alias instance", example = "1", required = true),
            @Parameter(name = "tag", description = "Tag name", example = "First floor", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed tag from alias", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Provided tag was empty"),
            @ApiResponse(responseCode = "401", description = "Alias not associated with company"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to add tag")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/alias/{instanceId}/tag/{tag}")
    public ResponseEntity<?> removeTag(HttpServletRequest request, @PathVariable("instanceId") long instanceId, @PathVariable("tag") String tag) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Optional<ComponentAlias> componentAlias = componentAliasRepository.findById(instanceId);
        if (componentAlias.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Associated alias not found");

        if (!StringUtils.hasLength(tag))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tag is not set or empty");

        var alias = componentAlias.get();
        if (company.getId() != alias.getComponentAsset().getCompany().getId())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Asset does not belong to company");

        try {
            var ca = componentAssetService.removeTag(alias, tag);
            return ResponseEntity.ok(ComponentAssetDTO.from(ca));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Add tag", description = "Adds tag to component alias in associated company")
    @Parameters({
            @Parameter(name = "instanceId", description = "ID that corresponds to component alias instance", example = "1", required = true),
            @Parameter(name = "tag", description = "Tag name", example = "First floor", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added tag to alias", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Provided tag was empty"),
            @ApiResponse(responseCode = "401", description = "Alias not associated with company"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to add tag")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/alias/{instanceId}/tag/{tag}")
    public ResponseEntity<?> addTag(HttpServletRequest request, @PathVariable("instanceId") long instanceId, @PathVariable("tag") String tag) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Optional<ComponentAlias> componentAlias = componentAliasRepository.findById(instanceId);
        if (componentAlias.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Associated alias not found");

        if (!StringUtils.hasLength(tag))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tag is not set or empty");

        var alias = componentAlias.get();
        if (company.getId() != alias.getComponentAsset().getCompany().getId())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Asset does not belong to company");

        try {
            var ca = componentAssetService.addTag(alias, tag);
            return ResponseEntity.ok(ComponentAssetDTO.from(ca));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Rename alias", description = "Renames alias in component asset in associated company")
    @Parameters({
            @Parameter(name = "instanceId", description = "ID that corresponds to component alias instance", example = "1", required = true),
            @Parameter(name = "alias", description = "New alias name", example = "Don's Computer", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully renamed alias", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Provided alias invalid"),
            @ApiResponse(responseCode = "401", description = "Alias not associated with company"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Associated alias was not found"),
            @ApiResponse(responseCode = "500", description = "Failed to rename alias")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/alias/{instanceId}/rename/{alias}")
    public ResponseEntity<?> renameAlias(HttpServletRequest request, @PathVariable("instanceId") long instanceId, @PathVariable("alias") String alias) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Optional<ComponentAlias> componentAlias_ = componentAliasRepository.findById(instanceId);
        if (componentAlias_.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Associated alias not found");

        if (!StringUtils.hasLength(alias))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Alias is not set or empty");

        var componentAlias = componentAlias_.get();
        if (company.getId() != componentAlias.getComponentAsset().getCompany().getId())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Asset does not belong to company");

        try {
            var ca = componentAssetService.renameAlias(componentAlias, alias);
            return ResponseEntity.ok(ComponentAssetDTO.from(ca));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Remove alias", description = "Removes alias from component in associated company")
    @Parameters({
            @Parameter(name = "componentId", description = "ID that corresponds to component", example = "1", required = true),
            @Parameter(name = "alias", description = "Alias name", example = "Norm's Computer", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added alias to component", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Provided alias was invalid"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to add alias")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{componentId}/alias/{alias}")
    public ResponseEntity<?> removeAlias(HttpServletRequest request, @PathVariable("componentId") long componentId, @PathVariable("alias") String name) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Component component = componentService.getComponent(componentId);
        Optional<ComponentAsset> componentAsset = componentAssetService.findByCompanyAndComponent(company, component);
        if (componentAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The component was already added as asset");

        if (!StringUtils.hasLength(name))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Alias is not set or empty");

        Optional<Alias> alias = aliasRepository.findByNameAndCompanyId(name, company.getId());
        if (alias.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Alias could not be identified");

        var asset = componentAsset.get();
        try {
            var ca = componentAssetService.removeAlias(asset, alias.get());
            return ResponseEntity.ok(ComponentAssetDTO.from(ca));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Add alias", description = "Adds alias to component in associated company")
    @Parameters({
            @Parameter(name = "componentId", description = "ID that corresponds to component", example = "1", required = true),
            @Parameter(name = "alias", description = "Alias name", example = "Norm's Computer", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added alias to component", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Provided alias was empty"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to add alias")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{componentId}/alias/{alias}")
    public ResponseEntity<?> addAlias(HttpServletRequest request, @PathVariable("componentId") long componentId, @PathVariable("alias") String alias) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Component component = componentService.getComponent(componentId);
        Optional<ComponentAsset> componentAsset = componentAssetService.findByCompanyAndComponent(company, component);
        if (componentAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The component was not added as asset");

        if (!StringUtils.hasLength(alias))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Alias is not set or empty");

        var asset = componentAsset.get();
        try {
            var ca = componentAssetService.addAlias(asset, alias);
            return ResponseEntity.ok(ComponentAssetDTO.from(ca));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "Add component", description = "Adds component as asset to associated company")
    @Parameters({
            @Parameter(name = "componentId", description = "ID that corresponds to component", example = "183", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added component as asset", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Non-leaf component can't be added"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component already added"),
            @ApiResponse(responseCode = "500", description = "Failed to add component")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{componentId}")
    public ResponseEntity<?> addComponent(HttpServletRequest request, @PathVariable("componentId") long componentId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Component component = componentService.getComponent(componentId);
        if (!component.getChildren().isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The selected component is not a leaf and cannot be added as an asset.");

        if (componentAssetService.findByCompanyAndComponent(company, component).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The component was already added as asset");

        ComponentAsset ca = componentAssetService.addComponentAsset(company, component);
        return ResponseEntity.ok(ComponentAssetDTO.from(ca));
    }

    @Operation(summary = "Get component asset", description = "Gets component asset from associated company")
    @Parameters({
            @Parameter(name = "componentId", description = "ID that corresponds to component", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved component asset", content = {@Content(schema = @Schema(implementation = ComponentAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve component asset")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{componentId}")
    public ResponseEntity<?> getComponent(HttpServletRequest request, @PathVariable("componentId") long componentId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Component component = componentService.getComponent(componentId);
        Optional<ComponentAsset> componentAsset = componentAssetService.findByCompanyAndComponent(company, component);
        if (componentAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The component was not an asset");

        return ResponseEntity.ok(ComponentAssetDTO.from(componentAsset.get()));
    }

    @Operation(summary = "Remove component", description = "Removes component as asset from associated company")
    @Parameters({
            @Parameter(name = "componentId", description = "ID that corresponds to component", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed component as asset"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Component was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to remove component")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{componentId}")
    public ResponseEntity<?> removeComponent(HttpServletRequest request, @PathVariable("componentId") long componentId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Component component = componentService.getComponent(componentId);
        Optional<ComponentAsset> componentAsset = componentAssetService.findByCompanyAndComponent(company, component);
        if (componentAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The component was not an asset");

        componentAssetService.deleteComponentAsset(componentAsset.get());
        return ResponseEntity.ok("Deleted asset of component with ID: " + componentId);
    }

    @Operation(summary = "Get component tree with assets", description = "Returns all components with associated asset information in light tree")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root components", content = {@Content(array = @ArraySchema(schema = @Schema(description = "Component information", implementation = ComponentAssetNodeDTO.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level components couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/tree-light")
    public ResponseEntity<?> getRootComponentsWithAssetInformation(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        List<Component> components = componentService.getRootComponents();

        if (components.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level components could not be identified");

        List<ComponentAsset> assets = componentAssetService.findByCompany(company);
        //List<? extends AssetNodeDTO<Component, ComponentAssetDTO, ?>> componentDTOs = components.stream().map(component -> AssetNodeDTO.fromComponentTyped(component, assets)).toList();
        List<ComponentAssetNodeDTO> componentDTOs = components.stream().map(component -> AssetNodeDTO.fromComponent(component, assets)).toList();
        return ResponseEntity.status(HttpStatus.OK).body(componentDTOs);
    }

}
