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
import ish.user.model.Company;
import ish.user.model.User;
import ish.user.model.asset.ControlAsset;
import ish.user.model.knowledge.ControlGuideline;
import ish.user.model.knowledge.SecurityControl;
import ish.user.service.asset.ControlAssetService;
import ish.user.service.knowledge.SecurityControlService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/control-asset")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Asset API", description = "Asset endpoint")
@CommonsLog
@AllArgsConstructor
public class ControlAssetController {

    private UserExtractor userExtractor;
    private ControlAssetService controlAssetService;
    private SecurityControlService controlService;

    @Operation(summary = "Count control assets", description = "Returns number of control assets in associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully counted control assets"),
            @ApiResponse(responseCode = "500", description = "Failed to count control assets")
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

        long assets = controlAssetService.countControls(company);
        return ResponseEntity.status(HttpStatus.OK).body(assets);
    }

    @Operation(summary = "Search security controls by criteria", description = "Returns corresponding security controls")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched security controls"),
            @ApiResponse(responseCode = "500", description = "Failed to search security controls")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search")
    public ResponseEntity<?> findControlsWithAssetsByCriteria(
            HttpServletRequest request,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Control search information", content = {@Content(schema = @Schema(implementation = ControlAssetSearchRequest.class), mediaType = "application/json")}, required = true)
            @RequestBody ControlAssetSearchRequest controlSearchRequest) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        ControlAssetSearchCriteria criteria = controlSearchRequest.getSearchCriteria();
        criteria.setCompany(company);

        Page<SecurityControl> controls = controlService.findByCriteria(criteria, controlSearchRequest.getPageable().toPageable());
        List<ControlAsset> assets = controlAssetService.findByCompany(company);

        Page<ControlAssetNodeDTO> controlDTOs = controls.map(component -> AssetNodeDTO.fromControl(component, assets));
        return ResponseEntity.status(HttpStatus.OK).body(controlDTOs);
    }

    @Operation(summary = "Set guidelines", description = "Sets control guidelines in associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to control", example = "1", required = true),
            @Parameter(name = "positions", description = "List of guideline positions (one-based index). Set to 0 to remove all guidelines.", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added implemented guideline", content = { @Content(schema = @Schema(implementation = ControlAssetDTO.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Found invalid guideline position"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Control was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to set guidelines")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{controlId}/guidelines/{positions}")
    public ResponseEntity<?> setGuidelines(HttpServletRequest request, @PathVariable("controlId") long controlId, @PathVariable("positions") List<Integer> positions) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = controlService.getControl(controlId);
        Optional<ControlAsset> controlAsset = controlAssetService.findByCompanyAndControl(company, control);
        if (controlAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was not an asset");

        var pos = new HashSet<>(positions);
        Optional<Integer> wrongPosition = pos.stream().filter(i -> i > control.getGuidelines().size()).findFirst();
        if (wrongPosition.isPresent())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Found invalid guideline position: " + wrongPosition.get());

        List<ControlGuideline> guidelines = new ArrayList<>(control.getGuidelines());
        guidelines.removeIf(guideline -> !positions.contains(guideline.getPosition()));

        var asset = controlAsset.get();
        var ca = controlAssetService.updateControlAsset(asset, guidelines);
        return ResponseEntity.ok(ControlAssetDTO.from(ca));
    }

    @Operation(summary = "Add control", description = "Adds control as asset to associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added control as asset", content = { @Content(schema = @Schema(implementation = ControlAssetDTO.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Non-leaf control can't be added"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Control already added"),
            @ApiResponse(responseCode = "500", description = "Failed to add control")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{controlId}")
    public ResponseEntity<?> addControl(HttpServletRequest request, @PathVariable("controlId") long controlId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = controlService.getControl(controlId);
        if(!control.getChildren().isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The selected control is not a leaf and cannot be added as an asset.");

        if (controlAssetService.findByCompanyAndControl(company, control).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was already added as asset");

        ControlAsset ca = controlAssetService.addControlAsset(company, control);
        return ResponseEntity.ok(ControlAssetDTO.from(ca));
    }

    @Operation(summary = "Get control asset", description = "Gets control asset from associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved control asset", content = {@Content(schema = @Schema(implementation = ControlAssetDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Control was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve control asset")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{controlId}")
    public ResponseEntity<?> getControl(HttpServletRequest request, @PathVariable("controlId") long controlId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = controlService.getControl(controlId);
        Optional<ControlAsset> controlAsset = controlAssetService.findByCompanyAndControl(company, control);
        if (controlAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was not an asset");

        return ResponseEntity.ok(ControlAssetDTO.from(controlAsset.get()));
    }

    @Operation(summary = "Remove control", description = "Removes control as asset from associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed control as asset"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Control was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to remove control")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{controlId}")
    public ResponseEntity<?> removeControl(HttpServletRequest request, @PathVariable("controlId") long controlId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = controlService.getControl(controlId);
        Optional<ControlAsset> controlAsset = controlAssetService.findByCompanyAndControl(company, control);
        if (controlAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was not an asset");

        controlAssetService.deleteControlAssets(controlAsset.get());
        return ResponseEntity.ok("Deleted asset of control with ID: " + controlId);
    }

    @Operation(summary = "Get control tree with assets", description = "Returns all controls with associated asset information in light tree")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root controls", content = {@Content(array = @ArraySchema(schema = @Schema(description = "Control information", implementation = ControlAssetNodeDTO.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level controls couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/tree-light")
    public ResponseEntity<?> getRootControlsWithAssetInformation(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        List<SecurityControl> controls = controlService.getRootControls();

        if (controls.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level controls could not be identified");

        List<ControlAsset> assets = controlAssetService.findByCompany(company);
        assets.forEach(ca -> {
            if (ca.getControl() != null) {
                ca.setControl((SecurityControl) Hibernate.unproxy(ca.getControl()));
            }
        });

        //List<? extends AssetNodeDTO<SecurityControl, ControlAssetDTO, ?>> controlDTOs = controls.stream().map(component -> AssetNodeDTO.fromControlTyped(component, assets)).toList();
        List<ControlAssetNodeDTO> controlDTOs = controls.stream().map(component -> AssetNodeDTO.fromControl(component, assets)).toList();
    return ResponseEntity.status(HttpStatus.OK).body(controlDTOs);
    }

}
