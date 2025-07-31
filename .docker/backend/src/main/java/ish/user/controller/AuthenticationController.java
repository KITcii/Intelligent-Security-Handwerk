package ish.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import ish.user.dto.CompanyDto;
import ish.user.dto.UserDto;
import ish.user.dto.auth.JwtDto;
import ish.user.dto.auth.LoginRequest;
import ish.user.dto.auth.LoginResponse;
import ish.user.dto.auth.PasswordUpdateRequest;
import ish.user.model.*;
import ish.user.model.location.Location;
import ish.user.model.security.JwtToken;
import ish.user.model.security.TokenType;
import ish.user.model.security.UserToken;
import ish.user.repository.RoleRepository;
import ish.user.repository.UserRepository;
import ish.user.repository.security.JwtTokenRepository;
import ish.user.service.notification.NotificationService;
import ish.user.service.notification.NotificationType;
import ish.user.service.security.UserTokenService;
import ish.user.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1.0/auth")
@Tag(name = "Authentication API", description = "User authentication endpoint")
@CommonsLog
@AllArgsConstructor
public class AuthenticationController {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private JwtTokenRepository jwtTokenRepository;
    private UserTokenService userTokenService;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;
    private NotificationService notificationService;

    // TODO https://www.baeldung.com/springdoc-openapi-form-login-and-basic-authentication

    @Operation(summary = "Login user", description = "Logs in user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged in", content = { @Content(schema = @Schema(implementation = LoginResponse.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", description = "Failed to authenticate user"),
            @ApiResponse(responseCode = "403", description = "User is not verified"),
            @ApiResponse(responseCode = "500", description = "Failed to log in user")
    })
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Log-in information", content = { @Content(schema = @Schema(implementation = LoginRequest.class), mediaType = "application/json") }, required = true)
            LoginRequest req) {

        Optional<User> user_ = userRepository.findByMail(req.getMail());
        if (user_.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to authenticate user");

        User user = user_.get();
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(Objects.toString(user.getId()), req.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to authenticate user");
        }

        if (!user.isVerified())
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not verified. Please verify your account first.");

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expireAt = issuedAt.plusDays(4);
        String jwt = jwtUtil.generateJwtToken(Objects.toString(user.getId()), Date.from(issuedAt.atZone(ZoneId.systemDefault()).toInstant()), Date.from(expireAt.atZone(ZoneId.systemDefault()).toInstant()));

        JwtToken jwtToken = new JwtToken();
        jwtToken.setToken(jwt);
        jwtToken.setUser(user);
        jwtToken.setIssuedAt(issuedAt);
        jwtToken.setExpiryDate(expireAt);
        jwtToken.setActive(true);
        jwtTokenRepository.save(jwtToken);

        // TODO get real company related to user (currently, there's only find by owner)
        Industry industry = Industry.builder()
                .name("Elektrische Installation")
                .subarea("Gebäudeinnenbau")
                .area("Bau")
                .build();

        /*
        Location location = Location.builder()
                .name("Durlach")
                .postalCode("76227")
                .county("Karlsruhe")
                .state("Baden-Württemberg")
                .country("Deutschland")
                .build();

         */

        Company company = Company.builder()
                .name("American Company Manufacturing Everything (ACME)")
                .owner(user)
                .users(Collections.emptyList())
                .profession(new Profession(2, "Test Profession"))
                .companyType(CompanyType.SMALL)
                //.location(location)
                .build();

        if (Objects.nonNull(user.getCompany()))
            company = user.getCompany();

        LoginResponse response = LoginResponse.builder()
                .jwt(new JwtDto(jwtToken))
                .user(UserDto.from(user))
                .company(CompanyDto.from(company))
                .build();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Forgot password", description = "Allows user to indicate they forgot their password. Sends mail with reset instructions and token")
    @Parameters({
            @Parameter(name = "mail", description = "Mail corresponding to user that forgot password", example = "norman.eugene@macdonald.com", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully indicated that user forgot password"),
            @ApiResponse(responseCode = "404", description = "User was not found"),
            @ApiResponse(responseCode = "500", description = "Failed to indicate that user forgot password")
    })
    @PostMapping("/password-forgot")
    public ResponseEntity<?> forgotPassword(@RequestParam String mail) {
        // see: https://www.baeldung.com/spring-security-registration-i-forgot-my-password
        User user = userRepository.findByMail(mail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mail address not found: " + mail));
        UserToken token = userTokenService.createPasswordResetToken(user);

        notificationService.sendNotification(user, NotificationType.PASSWORD_RESET, token.getToken());
        return ResponseEntity.ok("Password reset email sent.");
    }

    @Operation(summary = "Reset password", description = "Resets user password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully updated"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token"),
            @ApiResponse(responseCode = "500", description = "Failed to reset password")
    })
    @PostMapping("/password-reset")
    public ResponseEntity<?> resetPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Password reset information", content = { @Content(schema = @Schema(implementation = PasswordUpdateRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody PasswordUpdateRequest request) {
        UserToken token;
        try {
            token = findAndValidateToken(request.getToken());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        User user = token.getUser();
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedNewPassword);
        userRepository.save(user);

        userTokenService.deactivateToken(token);
        return ResponseEntity.ok("Password reset successful.");
    }


    @Operation(summary = "Choose password", description = "Allows invited user to choose password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully chosen"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token"),
            @ApiResponse(responseCode = "500", description = "Failed to choose password")
    })
    @PostMapping("/password-choose")
    public ResponseEntity<?> choosePassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Password reset information", content = { @Content(schema = @Schema(implementation = PasswordUpdateRequest.class), mediaType = "application/json") }, required = true)
            @RequestBody PasswordUpdateRequest request) {
        UserToken token;
        try {
            token = findAndValidateToken(request.getToken());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        User user = token.getUser();
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedNewPassword);

        // invited user is verified after setting the password
        user.setVerified(true);
        userRepository.save(user);

        userTokenService.deactivateToken(token);
        return ResponseEntity.ok("Password successfully chosen.");
    }

    private UserToken findAndValidateToken(String token) throws IllegalStateException {
        Optional<UserToken> token_ = userTokenService.findToken(token, TokenType.PASSWORD_RESET);
        boolean isValid = userTokenService.validateToken(token_);

        if (!isValid)
            throw new IllegalStateException("Invalid or expired token.");

        @SuppressWarnings("OptionalGetWithoutIsPresent")
        UserToken userToken = token_.get();
        return userToken;
    }

    @Operation(summary = "Verify token", description = "Verifies user token")
    @Parameters({
            @Parameter(name = "token", description = "Verification token corresponding to a user", required = true)
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully verified token"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token"),
            @ApiResponse(responseCode = "500", description = "Failed to verify token")
    })
    @PostMapping("verify")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        // https://www.baeldung.com/swagger-parameter-vs-schema
        Optional<UserToken> userToken = userTokenService.findToken(token, TokenType.VERIFICATION);
        boolean isValid = userTokenService.validateToken(userToken);

        if (!isValid)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");

        @SuppressWarnings("OptionalGetWithoutIsPresent")
        UserToken userToken_ = userToken.get();
        User user = userToken_.getUser();
        user.setVerified(true);
        userRepository.save(user);

        userTokenService.deactivateToken(userToken_);
        return ResponseEntity.ok("User successfully verified.");
    }

    @Operation(summary = "Logout user", description = "Logs off user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully logged off"),
            @ApiResponse(responseCode = "401", description = "No session found"),
            @ApiResponse(responseCode = "500", description = "Failed to log off user")
    })
    @PreAuthorize("hasAuthority('USER') or hasAuthority('OWNER') or hasAuthority('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");
        if (jwt == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No session found!");

        if (jwt.startsWith("Bearer "))
            jwt = jwt.substring(7);

        jwtTokenRepository.findByToken(jwt).ifPresent(token -> {
            token.setActive(false);
            jwtTokenRepository.save(token);
        });
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("User logged out successfully.");
    }

}
