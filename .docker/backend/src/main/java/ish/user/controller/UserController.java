package ish.user.controller;

import io.jsonwebtoken.lang.Collections;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.CompanyDto;
import ish.user.dto.ErrorMessageResponse;
import ish.user.dto.UserDto;
import ish.user.dto.UserDtoDetailed;
import ish.user.dto.auth.RegisterRequest;
import ish.user.model.*;
import ish.user.model.location.Location;
import ish.user.model.security.JwtToken;
import ish.user.model.security.TokenType;
import ish.user.model.security.UserToken;
import ish.user.repository.*;
import ish.user.repository.location.LocationRepository;
import ish.user.repository.security.JwtTokenRepository;
import ish.user.service.notification.NotificationService;
import ish.user.service.notification.NotificationType;
import ish.user.service.security.UserTokenService;
import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/users")
@Tag(name = "User API", description = "User management endpoint")
@CommonsLog
//@AllArgsConstructor(onConstructor_={@Autowired})
@AllArgsConstructor
public class UserController {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private CompanyRepository companyRepository;
    private LocationRepository locationRepository;
    private ProfessionRepository professionRepository;
    private UserTokenService userTokenService;
    private PasswordEncoder passwordEncoder;
    private UserExtractor userExtractor;
    private NotificationService notificationService;

    @Value("${ish.auth.skip-verification:#{false}}")
    private boolean skipVerification;

    @Operation(summary = "Get a user by id", description = "Returns a user as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to user", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved", content = {@Content(schema = @Schema(implementation = UserDtoDetailed.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "User was not found")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("(hasAuthority('USER') and @securitySrvUsr.isSelf(#id)) or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(HttpServletRequest request, @PathVariable("id") long id) {
        log.info("Getting user for ID: " + id);

        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var requester = u.get();
        Company requesterCompany = requester.getCompany();

        Optional<User> user_ = userRepository.findById(id);
        if (user_.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find user with ID: " + id);

        User user = user_.get();
        Company userCompany = user.getCompany();

        if (requester.getRoles().contains(new Role("ADMIN")) || requesterCompany.getId() == userCompany.getId()) {
            UserDtoDetailed userDto = UserDtoDetailed.from(user);
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized to access the given user");
    }

    @Operation(summary = "Update user", description = "Updates user as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to user", example = "1", required = true),
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully updated", content = {@Content(schema = @Schema(implementation = User.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "User was not found"),
            @ApiResponse(responseCode = "409", description = "User with given mail already exists")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("(hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')) and @securitySrvUsr.isSelf(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") long id,
                                        @RequestBody
                                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User information", content = {@Content(schema = @Schema(implementation = UserDto.class), mediaType = "application/json")}, required = true)
                                        UserDto u) {
        // https://stackoverflow.com/questions/2302802/how-to-fix-the-hibernate-object-references-an-unsaved-transient-instance-save
        // https://stackoverflow.com/questions/4179166/hibernate-how-to-fix-identifier-of-an-instance-altered-from-x-to-y
        Optional<User> user_ = userRepository.findById(id);
        if (user_.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find user with ID: " + id);

        User user = user_.get();
        if (Objects.nonNull(u.getMail()) && !user.getMail().equals(u.getMail()) && userRepository.existsByMail(u.getMail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with given mail already exist");

        Company company = user.getCompany();
        Set<Role> roles = user.getRoles();

        if (Objects.nonNull(u.getMail()) && !u.getMail().isEmpty())
            user.setMail(u.getMail());
        if (Objects.nonNull(u.getFirstName()))
            user.setFirstName(u.getFirstName());
        if (Objects.nonNull(u.getLastName()))
            user.setLastName(u.getLastName());

        // do not update primary key
        user.setId(id);
        // do not change company
        user.setCompany(company);
        // do not change roles
        user.setRoles(roles);

        User updatedUser = userRepository.save(user);
        return new ResponseEntity<>(UserDtoDetailed.from(updatedUser), HttpStatus.OK);
    }

    @Operation(summary = "Delete user", description = "Deletes user as per the id")
    @Parameters({
            @Parameter(name = "id", description = "ID that corresponds to user", example = "1", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully deleted"),
            @ApiResponse(responseCode = "401", description = "No session found"),
            @ApiResponse(responseCode = "404", description = "User was not found"),
            @ApiResponse(responseCode = "500", description = "Deletion of user failed")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("(hasAuthority('USER') and @securitySrvUsr.isSelf(#id)) or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(HttpServletRequest request, @PathVariable("id") long id) {
        log.info("Requested deletion of user with ID " + id);
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var requester = u.get();

        Optional<User> user_ = userRepository.findById(id);
        if (user_.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find user with ID: " + id);

        User user = user_.get();
        if (requester.getCompany().getId() != user.getCompany().getId())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized to access the given user");

        if (user.getRoles().contains(new Role("OWNER"))) {
            companyRepository.deleteById(user.getCompany().getId());
            log.info(String.format("Since user %s %s was a company owner, the associated company and users were also deleted.", user.getFirstName(), user.getLastName()));
        } else {
            userRepository.deleteById(id);
            log.info(String.format("User %s %s was successfully deleted", user.getFirstName(), user.getLastName()));
        }

        return ResponseEntity.status(HttpStatus.OK).body("Deleted user with ID: " + id);
    }


    @Operation(summary = "Register business-executive user", description = "Registers a new business-executive user that has a privileged role (e.g., is able to invite employees)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User successfully registered", content = {@Content(schema = @Schema(implementation = User.class), mediaType = "application/json")}),
            @ApiResponse(responseCode = "404", description = "Location was not found"),
            @ApiResponse(responseCode = "409", description = "User already exists"),
            @ApiResponse(responseCode = "424", description = "Role 'OWNER' could not be assigned"),
            @ApiResponse(responseCode = "500", description = "Registration of user failed", content = {@Content(schema = @Schema(implementation = ErrorMessageResponse.class), mediaType = "application/json")})
    })
    //@PermitAll // Not possible to relax security when overriding security filter-chain configuration. See: https://github.com/spring-projects/spring-security/issues/14371
    @PermitAll
    @PostMapping("/register")
    public ResponseEntity<?> registerOwner(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Registration information", content = {@Content(schema = @Schema(implementation = RegisterRequest.class), mediaType = "application/json")}, required = true)
            @RequestBody
            RegisterRequest request) {
        UserDto user = request.getUser();
        CompanyDto company = request.getCompany();

        if (userRepository.existsByMail(user.getMail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with given mail already exist");

        try {
            if (Objects.nonNull(company.getProfession()) && company.getProfession().isPresent()) {
                Optional<Profession> profession = professionRepository.findById(company.getProfession().get().getId());

                if (profession.isEmpty())
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profession with given ID was not found");

                company.setProfession(profession);
            }

            if (Objects.nonNull(company.getLocationId()) && company.getLocationId().isPresent()) {
                Optional<Location> location = locationRepository.findById(company.getLocationId().get());

                if (location.isEmpty())
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Location with given ID was not found");

                company.setLocation(location);
            }

            Company c = new Company();
            setFromOptional(c::setName, company.getName());
            setFromOptional(c::setProfession, company.getProfession());
            setFromOptional(c::setCompanyType, company.getCompanyType());
            setFromOptional(c::setLocation, company.getLocation());

            User _user = new User();
            _user.setMail(user.getMail());
            _user.setFirstName(user.getFirstName());
            _user.setLastName(user.getLastName());

            String hashedPassword = passwordEncoder.encode(request.getPassword());
            _user.setPassword(hashedPassword);

            Optional<Role> ownerRole = roleRepository.findByLabel(RoleId.OWNER);
            if (ownerRole.isEmpty())
                return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Role 'OWNER' not found");
            _user.setRoles(Collections.setOf(ownerRole.get()));

            _user.setVerified(skipVerification);
            _user = userRepository.save(_user);

            c.setOwner(_user);
            c = companyRepository.save(c);

            _user.setCompany(c);
            _user = userRepository.save(_user);

            c.setUsers(Collections.emptyList());
            if (!skipVerification) {
                // owner token should not expire
                UserToken token = userTokenService.createToken(_user, TokenType.VERIFICATION, 24 * 365 * 10);
                notificationService.sendNotification(_user, NotificationType.VERIFICATION, token.getToken());
            } else {
                log.info("Verification was skipped. Since ish.auth.skip-verification was set to true.");
            }

            return new ResponseEntity<>(_user, HttpStatus.CREATED);
        } catch (IllegalStateException s) {
            log.error("Manual error handling: " + s.getMessage(), s);
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "There seems to be an issue with the user's name", s);
        } catch (IllegalArgumentException | IllegalCallerException e) {
            throw e;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    private <T> void setFromOptional(Consumer<T> setter, Optional<T> value) {
        if (Objects.isNull(value))
            return;

        if (value.isPresent())
            setter.accept(value.get());
        else
            setter.accept(null);
    }

    @Operation(summary = "Invite user", description = "Invites a new employee, should only be called by business-executive users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully invited"),
            @ApiResponse(responseCode = "401", description = "No session found"),
            @ApiResponse(responseCode = "409", description = "User already exists"),
            @ApiResponse(responseCode = "424", description = "Associated role not found"),
            @ApiResponse(responseCode = "500", description = "Invitation of user failed")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(
            HttpServletRequest request,
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Invitation information", content = {@Content(mediaType = "application/json")}, required = true)
            UserDto user) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var owner = u.get();

        Optional<Role> userRole = roleRepository.findByLabel(RoleId.USER);
        if (userRole.isEmpty())
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Role 'USER' not found");

        if (userRepository.existsByMail(user.getMail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with given mail already exist");

        User _user = new User();
        _user.setFirstName(user.getFirstName());
        _user.setLastName(user.getLastName());
        _user.setMail(user.getMail());
        _user.setRoles(Collections.setOf(userRole.get()));
        _user.setVerified(false);
        _user.setCompany(owner.getCompany());

        _user = userRepository.save(_user);

        UserToken token = userTokenService.createPasswordResetToken(_user);
        log.info("Password selection information: " + token);
        notificationService.sendNotification(_user, NotificationType.INVITE, token.getToken());
        return ResponseEntity.ok("User invited successfully");
    }

    @Operation(summary = "Reinvite user", description = "Resends the user invitation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully invited"),
            @ApiResponse(responseCode = "404", description = "User doesn't exist"),
            @ApiResponse(responseCode = "500", description = "Invitation of user failed")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/reinvite")
    public ResponseEntity<?> resendInvite(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User ID", required = true)
            long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User doesn't exist");

        UserToken token = userTokenService.createPasswordResetToken(user.get());
        notificationService.sendNotification(user.get(), NotificationType.INVITE, token.getToken());
        return ResponseEntity.ok("User reinvited successfully");
    }

    @Operation(summary = "Change password", description = "Changes user password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully updated"),
            @ApiResponse(responseCode = "401", description = "No session found"),
            @ApiResponse(responseCode = "404", description = "User was not found"),
            @ApiResponse(responseCode = "500", description = "Failed to change password")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @PostMapping("/password-change")
    public ResponseEntity<?> changePassword(HttpServletRequest request,
                                            @RequestBody
                                            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "New password", required = true)
                                            String newPassword) {
        Optional<User> u = userExtractor.fromSession(request);
        if (u.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get user from session");

        var user = u.get();
        String hashedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedNewPassword);
        userRepository.save(user);

        return ResponseEntity.ok("Password change successful");
    }

}
