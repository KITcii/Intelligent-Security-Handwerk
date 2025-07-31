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
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.dto.knowledge.ControlSearchRequest;
import ish.user.dto.knowledge.KnowledgeNodeDTO;
import ish.user.model.knowledge.KnowledgeNode;
import ish.user.model.knowledge.SecurityControl;
import ish.user.service.knowledge.SecurityControlService;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/control")
@Tag(name = "Knowledge API", description = "Knowledge endpoint")
@CommonsLog
@AllArgsConstructor
public class SecurityControlController {

    private SecurityControlService controlService;

    @Operation(summary = "Search security controls by criteria", description = "Returns corresponding security controls")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched security controls"),
            @ApiResponse(responseCode = "500", description = "Failed to search security controls")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search-full")
    public ResponseEntity<Page<SecurityControl>> findControlsByCriteriaFull(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Search information", content = {@Content(schema = @Schema(implementation = ControlSearchRequest.class), mediaType = "application/json")}, required = true)
            @RequestBody ControlSearchRequest request) {
        Page<SecurityControl> controls = controlService.findByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(controls);
    }

    @Operation(summary = "Get control by id", description = "Returns a security control as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to the security control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved security control", content = {@Content(schema = @Schema(implementation = SecurityControl.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Security control was not found")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getControlById(@PathVariable("id") long id) {
        try {
            SecurityControl control = controlService.getControl(id);
            return ResponseEntity.status(HttpStatus.OK).body(control);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find security control with given ID");
        }
    }

    @Operation(summary = "Get controls by ids", description = "Returns security controls as per ids")
    @Parameters({
            @Parameter(name = "ids", description = "IDs that corresponds to the security controls", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved security controls", content = {@Content(array = @ArraySchema(arraySchema = @Schema(description = "Security  control information", implementation = SecurityControl.class)))}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/ids/{ids}")
    public ResponseEntity<?> getControlById(@PathVariable("ids") List<Long> ids) {
        List<SecurityControl> controls = controlService.getControls(ids);
        return ResponseEntity.status(HttpStatus.OK).body(controls);
    }

    @Operation(summary = "Get control tree", description = "Returns all security controls in light tree")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root security controls", content = {@Content(array = @ArraySchema(arraySchema = @Schema(description = "Security  control information", implementation = SecurityControl.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level security control couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/tree-light")
    public ResponseEntity<?> getControlTreeLight() {
        List<SecurityControl> controls = controlService.getRootControls();

        if (controls.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level controls could not be identified");

        List<KnowledgeNodeDTO<SecurityControl>> controlDTOs = controls.stream().map(KnowledgeNodeDTO::from).toList();
        return ResponseEntity.status(HttpStatus.OK).body(controlDTOs);
    }

    @Operation(summary = "Get detailed root controls", description = "Returns all root security controls with details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root security controls", content = {@Content(array = @ArraySchema(arraySchema = @Schema(description = "Security  control information", implementation = SecurityControl.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level security control couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/root")
    public ResponseEntity<?> getRootControls() {
        List<SecurityControl> controls = controlService.getRootControls();

        if (controls.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level controls could not be identified");

        return ResponseEntity.status(HttpStatus.OK).body(controls);
    }

}
