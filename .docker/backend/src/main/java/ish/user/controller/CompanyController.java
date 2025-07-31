package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.CompanyDto;
import ish.user.dto.UserDto;
import ish.user.dto.UserDtoDetailed;
import ish.user.model.Company;
import ish.user.model.Profession;
import ish.user.model.User;
import ish.user.model.location.Location;
import ish.user.repository.CompanyRepository;
import ish.user.repository.ProfessionRepository;
import ish.user.repository.location.LocationRepository;
import ish.user.repository.security.JwtTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/companies")
@Tag(name = "Company API", description = "Company management endpoint")
@CommonsLog
@AllArgsConstructor
public class CompanyController {

    private CompanyRepository companyRepository;
    private JwtTokenRepository jwtTokenRepository;
    private LocationRepository locationRepository;
    private ProfessionRepository professionRepository;
    private UserExtractor userExtractor;

    @Operation(summary = "Get users", description = "Retrieves company users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users successfully retrieved", content = { @Content(array = @ArraySchema(schema = @Schema(description = "User information", implementation = UserDto.class))) }),
            @ApiResponse(responseCode = "401", description = "No session found"),
            @ApiResponse(responseCode = "404", description = "Couldn't find user associated with session"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve users")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getCompanyUsers(HttpServletRequest request) {
        Optional<User> owner = userExtractor.fromSession(request);
        if (owner.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        List<UserDtoDetailed> users = owner.map(User::getCompany).map(Company::getUsers).stream()
                .flatMap(List::stream)
                .map(UserDtoDetailed::from)
                .peek(user -> user.setCompany(null))
                .toList();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Operation(summary = "Update company", description = "Updates given company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company successfully updated", content = { @Content(schema = @Schema(implementation = Company.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "IDs could not be found"),
            @ApiResponse(responseCode = "404", description = "Could not get user from session"),
            @ApiResponse(responseCode = "500", description = "Failed to update company")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PutMapping
    public ResponseEntity<?> updateCompany(HttpServletRequest request,
                                           @RequestBody
                                           @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Company information", content = { @Content(schema = @Schema(implementation = CompanyDto.class), mediaType = "application/json") }, required = true)
                                           CompanyDto company) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company c = user.getCompany();

        if (Objects.nonNull(company.getProfession()) && company.getProfession().isPresent()) {
            Optional<Profession> profession = professionRepository.findById(company.getProfession().get().getId());

            if (profession.isEmpty())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profession with given ID was not found");

            company.setProfession(profession);
        }

        if (Objects.nonNull(company.getLocationId()) && company.getLocationId().isPresent()) {
            Optional<Location> location = locationRepository.findById(company.getLocationId().get());

            if (location.isEmpty())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Location with given ID was not found");

            company.setLocation(location);
        }

        setFromOptional(c::setName, company.getName());
        setFromOptional(c::setProfession, company.getProfession());
        setFromOptional(c::setCompanyType, company.getCompanyType());
        setFromOptional(c::setLocation, company.getLocation());

        c = companyRepository.save(c);
        return new ResponseEntity<>(CompanyDto.from(c), HttpStatus.OK);
    }

    private <T> void setFromOptional(Consumer<T> setter, Optional<T> value) {
        if (Objects.isNull(value))
            return;

        if (value.isPresent())
            setter.accept(value.get());
        else
            setter.accept(null);
    }

    @Operation(summary = "Get company", description = "Retrieves associated company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved company", content = {@Content(schema = @Schema(implementation = CompanyDto.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Could not get user from session"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve company")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/my")
    public ResponseEntity<?> getCompany(HttpServletRequest request) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        Company company = user.getCompany();
        return ResponseEntity.ok(CompanyDto.from(company));
    }
}
