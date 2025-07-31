package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.assessment.AssessmentDTO;
import ish.user.dto.assessment.Grade;
import ish.user.model.Company;
import ish.user.model.User;
import ish.user.model.assessment.StandardElement;
import ish.user.model.knowledge.KnowledgeNodeUtils;
import ish.user.repository.assessment.StandardElementRepository;
import ish.user.repository.knowledge.SecurityControlRepository;
import ish.user.service.asset.ControlAssetService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/assessment")
@Tag(name = "Assessment API", description = "Security-level assessment endpoint")
@CommonsLog
@AllArgsConstructor
public class AssessmentController {

    private UserExtractor userExtractor;
    private ControlAssetService controlAssetService;
    private StandardElementRepository standardElementRepository;
    private SecurityControlRepository securityControlRepository;

    @Operation(summary = "Get security score", description = "Retrieves security assessment score")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved score", content = {@Content(schema = @Schema(implementation = AssessmentDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Couldn't find token associated with session"),
            @ApiResponse(responseCode = "424", description = "Security-standard data for coverage not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve assessment score")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/score")
    public ResponseEntity<?> getAssessmentScore(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();

        var roots = standardElementRepository.findRootElements();
        if (roots.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level standard element could not be located");

        StandardElement root = roots.get(0);
        double implementedLeafControls = controlAssetService.countControls(company);
        double leafControls = securityControlRepository.countLeafControls();
        double coverage = implementedLeafControls / leafControls;

        Grade grade = determineGrade(coverage);
        var builder = AssessmentDTO.builder().standardElementId(root.getId()).name(root.getName()).coverage(coverage).website(root.getWebsite()).grade(grade);
        return ResponseEntity.ok(builder.build());
    }

    private Grade determineGrade(double coverage) {
        Grade grade = Grade.INSUFFICIENT;

        int coveragePermille = (int) (coverage * 1000);
        if (coveragePermille > 350)
            grade = Grade.VERY_GOOD;
        else if (coveragePermille > 200)
            grade = Grade.GOOD;
        else if (coveragePermille > 50)
            grade = Grade.SATISFACTORY;

        return grade;
    }

    @Operation(summary = "Get chart data", description = "Retrieves security-assessment chart data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved chart data", content = {@Content(schema = @Schema(implementation = AssessmentDTO.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Couldn't find token associated with session"),
            @ApiResponse(responseCode = "424", description = "Security-standard data for coverage not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve chart data")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/chart-data")
    public ResponseEntity<?> getAssessmentChart(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        var company = user.getCompany();

        var roots = standardElementRepository.findRootElements();
        if (roots.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level standard element could not be located");

        // TODO get control-asset/tree-light

        StandardElement root = roots.get(0);
        List<StandardElement> elements = root.getChildren();
        List<AssessmentDTO> sections = new ArrayList<>();
        for (var element : elements) {
            // get control-asset subtree for each element control
            var leafControls = element.getControls().stream().map(KnowledgeNodeUtils::getSubtreeAsList).flatMap(List::stream).filter(sc -> sc.getChildren().isEmpty()).toList();
            double implementedOrInProcess = controlAssetService.countControlsOf(company, leafControls);
            // count implemented vs total guidelines

            double coverage = 0;
            if (!leafControls.isEmpty())
                coverage = implementedOrInProcess / leafControls.size();

            var dto = AssessmentDTO.builder().standardElementId(element.getId()).name(element.getName()).coverage(coverage).grade(determineGrade(coverage)).build();
            sections.add(dto);
        }

        double implementedLeafControls = controlAssetService.countControls(company);
        double leafControls = securityControlRepository.countLeafControls();
        double coverage = implementedLeafControls / leafControls;
        Grade grade = determineGrade(coverage);

        var builder = AssessmentDTO.builder().standardElementId(root.getId()).name(root.getName()).website(root.getWebsite()).coverage(coverage).grade(grade).sections(sections);
        return ResponseEntity.ok(builder.build());
    }

    @Operation(summary = "Get assessment dimensions", description = "Retrieves security assessment dimensions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved assessment dimensions", content = {@Content(schema = @Schema(implementation = StandardElement.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "424", description = "Security-standard data for coverage not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve assessment dimensions")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/chart-dimensions")
    public ResponseEntity<?> getAssessmentDimensions() {
        var roots = standardElementRepository.findRootElements();

        if (roots.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Unfortunately, top-level standard element could not be located");

        return ResponseEntity.ok(roots);
    }

}
