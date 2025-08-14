package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.model.Profession;
import ish.user.repository.ProfessionRepository;
import jakarta.annotation.security.PermitAll;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/professions")
@Tag(name = "Profession API", description = "Profession endpoint")
@CommonsLog
@AllArgsConstructor
public class ProfessionController {

    private ProfessionRepository professionRepository;

    @Operation(summary = "Get all professions", description = "Returns all professions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved professions", content = { @Content(array = @ArraySchema(arraySchema = @Schema(description = "Profession information", implementation = Profession.class))) }),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve professions")
    })
    @PermitAll
    @GetMapping("/all")
    public ResponseEntity<?> getProfessions() {
        List<Profession> professions = professionRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(professions);
    }
}
