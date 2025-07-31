package ish.user.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.security.JwtToken;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Schema(description = "JWT information")
public class JwtDto {

    @Schema(description = "Token")
    private String token;

    @Schema(description = "Issuance date")
    private LocalDateTime issuedAt;

    @Schema(description = "Expiry date")
    private LocalDateTime expiryDate;

    public JwtDto(JwtToken token) {
        this.token = token.getToken();
        this.issuedAt = token.getIssuedAt();
        this.expiryDate = token.getExpiryDate();
    }
}
