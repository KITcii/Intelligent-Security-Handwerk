package ish.user.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Password update information")
public class PasswordUpdateRequest {

    @Schema(description = "Password reset token")
    private String token;

    @Schema(description = "New password", example = "new-string")
    private String newPassword;
}
