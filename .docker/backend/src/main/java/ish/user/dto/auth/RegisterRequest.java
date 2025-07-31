package ish.user.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.CompanyDto;
import ish.user.dto.UserDto;
import lombok.Data;

@Data
@Schema(description = "Registration information")
public class RegisterRequest {

    @Schema(description = "User information", implementation = UserDto.class)
    private UserDto user;

    @Schema(description = "Password", example = "string")
    private String password;

    @Schema(description = "Company information", implementation = CompanyDto.class)
    private CompanyDto company;
}
