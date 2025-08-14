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
import ish.user.dto.glossary.*;
import ish.user.model.glossary.Category;
import ish.user.model.glossary.Term;
import ish.user.repository.glossary.CategoryRepository;
import ish.user.repository.glossary.TermRepository;
import ish.user.service.TermService;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/glossary")
@Tag(name = "Glossary API", description = "Glossary management endpoint")
@CommonsLog
@AllArgsConstructor
public class GlossaryController {

    private TermService termService;
    private TermRepository termRepository;
    private CategoryRepository categoryRepository;

    // TODO Add CRUD methods

    @Operation(summary = "Get glossary entry by id", description = "Returns a glossary entry as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to the glossary entry", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved entry", content = { @Content(schema = @Schema(implementation = Term.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Entry was not found")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getGlossaryEntryById(@PathVariable("id") long id) {
        log.info("Getting glossary entry for ID: " + id);
        Optional<Term> t = termRepository.findById(id);
        if (t.isEmpty())
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find term corresponding to ID");

        var term = t.get();
        var category = term.getCategory();
        var enrichedMap = termService.enrichTextWithGlossaryTerms(term.getDescription());
        var reducedMap = enrichedMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> TermReduced.from(entry.getValue())
                ));
        reducedMap.remove(term.getKeyword());

        var response = DetailedTermResponse.builder().term(term).category(category).references(reducedMap).build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "Get random glossary entry", description = "Returns a random glossary entry")
    @Parameters({
            @Parameter(name = "categoryId", description = "Optional category ID that limits random entries to given category")
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved entry", content = { @Content(schema = @Schema(implementation = Term.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/random")
    public ResponseEntity<?> getGlossaryEntryRandom(@RequestParam(required = false) Long categoryId) {
        log.info("Getting random glossary entry");

        Term term;
        if (Objects.nonNull(categoryId)) {
            Optional<Category> category = categoryRepository.findById(categoryId);

            if (category.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find category for ID: " + categoryId);

            term = termService.getRandomGlossaryEntryByCategory(category.get());
        } else {
            term = termService.getRandomGlossaryEntry();
        }

        if (Objects.isNull(term))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find glossary entry");

        var category = term.getCategory();
        var enrichedMap = termService.enrichTextWithGlossaryTerms(term.getDescription());
        var reducedMap = enrichedMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> TermReduced.from(entry.getValue())
                ));
        reducedMap.remove(term.getKeyword());

        var response = DetailedTermResponse.builder().term(term).category(category).references(reducedMap).build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "Get categories", description = "Returns all glossary categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories", content = { @Content(array = @ArraySchema(arraySchema = @Schema(implementation = Category.class)), mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        var categories = categoryRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(categories);
    }

    @Operation(summary = "Search glossary IDs and keywords by category", description = "Returns glossary IDs and keywords corresponding to category (not full glossary data)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched glossary"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search-by-category")
    public ResponseEntity<Page<TermLight>> findTermsByCategory(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Pagination information", content = { @Content(schema = @Schema(implementation = SearchByCategoryRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody
            SearchByCategoryRequest request) {
        var criteria = SearchCriteria.builder().category(request.getCategory()).build();
        Page<TermLight> termsPage = termService.findLightByCriteria(criteria, request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(termsPage);
    }

    @Operation(summary = "Search glossary IDs and keywords by criteria", description = "Returns glossary IDs and keywords corresponding to criteria (not full glossary data)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched glossary"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search")
    public ResponseEntity<Page<TermLight>> findTermsByCriteria(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Glossary search information", content = { @Content(schema = @Schema(implementation = GlossarySearchRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody GlossarySearchRequest request) {
        Page<TermLight> termsPage = termService.findLightByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(termsPage);
    }

    @Operation(summary = "Search glossary entries by criteria", description = "Returns corresponding glossary entries")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched glossary"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/search-full")
    public ResponseEntity<Page<Term>> findTermsByCriteriaFull(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Glossary search information", content = { @Content(schema = @Schema(implementation = GlossarySearchRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody GlossarySearchRequest request) {
        Page<Term> termsPage = termService.findByCriteria(request.getSearchCriteria(), request.getPageable().toPageable());
        return ResponseEntity.status(HttpStatus.OK).body(termsPage);
    }

    @Operation(summary = "Enrich text with glossary terms", description = "Returns a mapping of text passages to glossary terms")
    @Parameters({
            @Parameter(name = "text", description = "Text passage that should be enriched with glossary terms", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved entry", content = { @Content(mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Entry was not found")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/enrich")
    public ResponseEntity<?> enrichTexWithGlossaryTerms(@RequestParam("text") String text) {
        Map<String, Term> enrichedMap = termService.enrichTextWithGlossaryTerms(text);
        Map<String, TermReduced> reducedMap = enrichedMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> TermReduced.from(entry.getValue())
                ));

        // TODO own class for return value
        return ResponseEntity.status(HttpStatus.OK).body(reducedMap);
    }
}
