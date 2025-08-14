package ish.user.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.CompanyDto;
import ish.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
@Schema(description = "Login response")
public class LoginResponse {

    @Schema(description = "JWT information")
    private JwtDto jwt;

    @Schema(description = "User information")
    private UserDto user;

    @Schema(description = "Company information")
    private CompanyDto company;

    public LoginResponse() {
    }
}
