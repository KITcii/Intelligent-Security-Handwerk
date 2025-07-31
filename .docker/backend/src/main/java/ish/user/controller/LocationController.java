package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.dto.location.LocationDTO;
import ish.user.dto.location.LocationSearchRequest;
import ish.user.model.location.Location;
import ish.user.repository.location.LocationRepository;
import ish.user.service.LocationService;
import jakarta.annotation.security.PermitAll;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/locations")
@Tag(name = "Location API", description = "Location endpoint")
@CommonsLog
@AllArgsConstructor
public class LocationController {

    private LocationService locationService;
    private LocationRepository locationRepository;

    @Operation(summary = "Get location by id", description = "Returns a location as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to the glossary entry", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved location", content = { @Content(schema = @Schema(implementation = Location.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "404", description = "Location was not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve location")
    })
    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable("id") long id) {
        log.info("Getting location for ID: " + id);
        Optional<Location> location = locationRepository.findById(id);
        if (location.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find location corresponding to ID");

        return ResponseEntity.status(HttpStatus.OK).body(location);
    }

    @Operation(summary = "Search locations by criteria", description = "Returns location IDs, names, and postal codes corresponding to criteria (not full location data)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched location"),
            @ApiResponse(responseCode = "500", description = "Failed to search locations")
    })
    @PermitAll
    @PostMapping("/search")
    public ResponseEntity<Page<LocationDTO>> findTermsByCriteria(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Location search information", content = { @Content(schema = @Schema(implementation = LocationSearchRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody LocationSearchRequest request) {
        Page<LocationDTO> termsPage = locationService.findLightByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(termsPage);
    }

    @Operation(summary = "Search locations by criteria", description = "Returns corresponding locations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched glossary"),
            @ApiResponse(responseCode = "500", description = "Failed to search locations")
    })
    @PermitAll
    @PostMapping("/search-full")
    public ResponseEntity<Page<Location>> findTermsByCriteriaFull(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Location search information", content = { @Content(schema = @Schema(implementation = LocationSearchRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody LocationSearchRequest request) {
        Page<Location> termsPage = locationService.findByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(termsPage);
    }
}
