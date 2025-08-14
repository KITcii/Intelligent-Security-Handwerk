package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.PageRequest;
import ish.user.dto.asset.ComponentAssetDTO;
import ish.user.dto.asset.ControlAssetDTO;
import ish.user.dto.knowledge.KnowledgeNodeDTO;
import ish.user.dto.recommendation.*;
import ish.user.dto.support.EducationSearchCriteria;
import ish.user.dto.support.EducationSearchRequest;
import ish.user.model.Company;
import ish.user.model.User;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.asset.ControlAsset;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.SecurityControl;
import ish.user.model.support.Listing;
import ish.user.model.support.Offer;
import ish.user.model.support.Topic;
import ish.user.repository.CompanyRepository;
import ish.user.service.ListingService;
import ish.user.service.asset.ComponentAssetService;
import ish.user.service.asset.ControlAssetService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/recommendations")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Recommendation API", description = "Recommendation management endpoint")
@CommonsLog
@AllArgsConstructor
public class RecommendationController {

    private UserExtractor userExtractor;
    private ControlAssetService controlAssetService;
    private ComponentAssetService componentAssetService;
    private ListingService listingService;

    private CompanyRepository companyRepository;

    @Operation(summary = "Count recommendations", description = "Returns number of recommended controls in associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully counted recommendations"),
            @ApiResponse(responseCode = "500", description = "Failed to count recommendations")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<?> getRecommendationCount(
            HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        long assets = controlAssetService.countRecommendedControls(company);
        return ResponseEntity.status(HttpStatus.OK).body(assets);
    }

    @Operation(summary = "Get recommendations", description = "Returns recommended controls in associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recommendations"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve recommendations")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/all")
    public ResponseEntity<?> getRecommendations(
            HttpServletRequest request,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Pagination information", content = { @Content(schema = @Schema(implementation = PageRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody PageRequest pageable) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        Page<ControlAsset> recommendedControls = controlAssetService.findRecommendedControls(company, pageable.toPageable());
        recommendedControls.forEach(ca -> {
            if (ca.getControl() != null) {
                ca.setControl((SecurityControl) Hibernate.unproxy(ca.getControl()));
            }
        });

        Page<ControlAssetDTO> recommendations = recommendedControls.map(ca -> ControlAssetDTO.from(ca, true));
        return ResponseEntity.status(HttpStatus.OK).body(recommendations);
    }

    @Operation(summary = "Get recommendations", description = "Returns recommended controls in associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recommendations"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve recommendations")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/all-unpaged")
    public ResponseEntity<?> getRecommendationsDetailed(
            HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        List<ControlAsset> controls = controlAssetService.findRecommendedControls(company);
        controls.forEach(ca -> {
            if (ca.getControl() != null) {
                ca.setControl((SecurityControl) Hibernate.unproxy(ca.getControl()));
            }
        });
        var dtos = controls.stream().map(ca -> ControlAssetDTO.from(ca, true)).collect(Collectors.toCollection(ArrayList::new));

        /*
        List<KnowledgeNodeDTO<SecurityControl>> recommendations = controls.stream()
                .map(ControlAsset::getControl)
                .map(KnowledgeNodeDTO::from)
                .collect(Collectors.toCollection(ArrayList::new));
         */
        return ResponseEntity.status(HttpStatus.OK).body(dtos);
    }

    @Operation(summary = "Get recommendation", description = "Returns recommended control assets in associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to the security control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recommendations", content = {@Content(schema = @Schema(implementation = SecurityControl.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve recommendations")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/{controlId}")
    public ResponseEntity<?> getRecommendation(
            HttpServletRequest request, @PathVariable("controlId") long controlId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = new SecurityControl();
        control.setId(controlId);

        Optional<ControlAsset> controlAsset = controlAssetService.findByCompanyAndControl(company, control);
        if (controlAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was not an asset");

        ControlAsset asset = controlAsset.get();
        if (asset.getControl() != null) {
            asset.setControl((SecurityControl) Hibernate.unproxy(asset.getControl()));
        }

        control = asset.getControl();
        // TODO fix this, but currently controls are related to components via control parent
        var controlParent = control.getParent();
        List<ComponentAsset> components = componentAssetService.findByCompanyAndRelatedControls(company, List.of(controlParent));
        components.forEach(ca -> {
            if (ca.getComponent() != null) {
                ca.setComponent((Component) Hibernate.unproxy(ca.getComponent()));
            }
        });
        var componentAssets = components.stream().map(ca -> ComponentAssetDTO.from(ca, true)).collect(Collectors.toCollection(ArrayList::new));
        String description = control.getDescription();
        List<String> controlDescription = Arrays.stream(description.split("\\s+|-"))
                .filter(StringUtils::hasLength)
                .filter(word -> Character.isUpperCase(word.charAt(0)))
                .toList();
        var criteria = EducationSearchCriteria.builder().topicDescriptionsLike(controlDescription).build();
        var listings = listingService.findByCriteria(criteria);

        // TODO test data; remove later
        if (listings.isEmpty())
            listings.addAll(listingService.findbyIds(Arrays.asList(1L, 2L, 3L, 4L)));

        Set<Topic> topics = listings.stream()
                .map(Listing::getOffer)
                .map(Offer::getTopics)
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        // TODO compute real statistic
        double percent = 0;
        double companies = controlAssetService.countCompanies(control);
        if (companies > 0)
            percent = companies / companyRepository.count();

        StatisticDTO statistic = new StatisticDTO(company.getProfession(), percent);

        RecommendationResponse response = RecommendationResponse.builder()
                .recommendation(RecommendationDTO.from(control))
                .state(ControlAssetDTO.from(asset, true))
                .components(componentAssets)
                .sources(List.of(new SourceDTO("BSI IT-Grundschutz", control.getLabel(), "https://www.bsi.bund.de")))
                .statistic(statistic)
                .support(new RecommendationSupportDTO(topics, listings))
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "Change relevance", description = "Flips relevance of control asset from associated company")
    @Parameters({
            @Parameter(name = "controlId", description = "ID that corresponds to control", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully flipped relevance"),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "409", description = "Control was not an asset"),
            @ApiResponse(responseCode = "500", description = "Failed to flip relevance control")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/relevance/{controlId}")
    public ResponseEntity<?> changeRelevance(HttpServletRequest request, @PathVariable("controlId") long controlId) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        SecurityControl control = new SecurityControl();
        control.setId(controlId);
        Optional<ControlAsset> controlAsset = controlAssetService.findByCompanyAndControl(company, control);
        if (controlAsset.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The control was not an asset");

        var ca = controlAssetService.flipRelevance(controlAsset.get());
        return ResponseEntity.ok(ca);
    }

}
