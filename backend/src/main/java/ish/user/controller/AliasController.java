package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import ish.user.controller.util.UserExtractor;
import ish.user.model.Company;
import ish.user.model.User;
import ish.user.model.asset.Alias;
import ish.user.model.asset.Tag;
import ish.user.service.asset.AliasService;
import ish.user.service.asset.TagService;
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

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/alias")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Alias API", description = "Alias management endpoint")
@CommonsLog
@AllArgsConstructor
public class AliasController {

    private UserExtractor userExtractor;
    private AliasService aliasService;
    private TagService tagService;

    @Operation(summary = "Get aliases", description = "Retrieves all aliases within associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed tag from alias", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = Alias.class)))}),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "500", description = "Failed to get aliases")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/all")
    public ResponseEntity<?> getAliases(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();
        List<Alias> aliases = aliasService.getAllAliases(company);
        return ResponseEntity.ok(aliases);
    }

    @Operation(summary = "Get tags", description = "Retrieves all tags within associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved tags", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = Tag.class)))}),
            @ApiResponse(responseCode = "404", description = "Couldn't not get user from session"),
            @ApiResponse(responseCode = "500", description = "Failed get tags")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/tags")
    public ResponseEntity<?> getTags(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();
        List<Tag> tags = tagService.getAllTags(company);
        return ResponseEntity.ok(tags);
    }

}
