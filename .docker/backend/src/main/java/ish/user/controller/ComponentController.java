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
import ish.user.dto.knowledge.ComponentSearchRequest;
import ish.user.dto.knowledge.KnowledgeNodeDTO;
import ish.user.model.knowledge.Component;
import ish.user.service.knowledge.ComponentService;
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
@RequestMapping("/api/v1.0/component")
@Tag(name = "Knowledge API", description = "Knowledge endpoint")
@CommonsLog
@AllArgsConstructor
public class ComponentController {

    private ComponentService componentService;

    @Operation(summary = "Search components by criteria", description = "Returns corresponding components")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched components"),
            @ApiResponse(responseCode = "500", description = "Failed to search components")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search-full")
    public ResponseEntity<Page<Component>> findComponentsByCriteriaFull(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Search information", content = {@Content(schema = @Schema(implementation = ComponentSearchRequest.class), mediaType = "application/json")}, required = true)
            @RequestBody ComponentSearchRequest request) {
        Page<Component> components = componentService.findByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(components);
    }

    @Operation(summary = "Get component by id", description = "Returns a component as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to the component", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved component", content = {@Content(schema = @Schema(implementation = Component.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Component was not found")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getComponentById(@PathVariable("id") long id) {
        try {
            Component component = componentService.getComponent(id);
            return ResponseEntity.status(HttpStatus.OK).body(component);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find component with given ID");
        }
    }

    @Operation(summary = "Get components by ids", description = "Returns components as per ids")
    @Parameters({
            @Parameter(name = "ids", description = "IDs that correspond to the components", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved component", content = {@Content(array = @ArraySchema(arraySchema = @Schema(description = "Component information", implementation = Component.class)))}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/ids/{ids}")
    public ResponseEntity<?> getComponentById(@PathVariable("ids") List<Long> ids) {
        List<Component> components = componentService.getComponents(ids);
        return ResponseEntity.status(HttpStatus.OK).body(components);
    }

    @Operation(summary = "Get component tree", description = "Returns all components in light tree")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root components", content = {@Content(array = @ArraySchema(schema = @Schema(description = "Component information", implementation = Component.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level components couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/tree-light")
    public ResponseEntity<?> getRootComponentsLight() {
        List<Component> components = componentService.getRootComponents();

        if (components.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level components could not be identified");

        List<KnowledgeNodeDTO<Component>> componentDTOs = components.stream().map(KnowledgeNodeDTO::from).toList();
        return ResponseEntity.status(HttpStatus.OK).body(componentDTOs);
    }

    @Operation(summary = "Get detailed root components", description = "Returns all root components with details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved root components", content = {@Content(array = @ArraySchema(schema = @Schema(description = "Component information", implementation = Component.class)))}),
            @ApiResponse(responseCode = "424", description = "Root-level components couldn't be identified")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/root")
    public ResponseEntity<?> getRootComponents() {
        List<Component> components = componentService.getRootComponents();

        if (components.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level components could not be identified");

        return ResponseEntity.status(HttpStatus.OK).body(components);
    }

}
