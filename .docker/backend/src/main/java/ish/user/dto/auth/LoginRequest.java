package ish.user.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Login information")
public class LoginRequest {

    @Schema(description = "Mail address", example = "norman.eugene@macdonald.com")
    private String mail;

    @Schema(description = "Password", example = "string")
    private String password;
}
