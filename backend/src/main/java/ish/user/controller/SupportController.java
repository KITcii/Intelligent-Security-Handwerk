package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.dto.support.EducationSearchRequest;
import ish.user.model.support.Listing;
import ish.user.service.ListingService;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/support") // TODO rename to support
@Tag(name = "Support API", description = "Support endpoint")
@CommonsLog
@AllArgsConstructor
public class SupportController {

    private ListingService listingService;

    @Operation(summary = "Search listings by criteria", description = "Returns corresponding listings")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched listings"),
            @ApiResponse(responseCode = "500", description = "Failed to search listings")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search-full")
    public ResponseEntity<Page<Listing>> findListingsByCriteriaFull(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Education search information", content = { @Content(schema = @Schema(implementation = EducationSearchRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody EducationSearchRequest request) {
        Page<Listing> listingPage = listingService.findByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(listingPage);
    }

}
