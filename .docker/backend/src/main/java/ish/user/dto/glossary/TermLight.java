package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Lightweight glossary term")
public class TermLight {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Company ID", example = "123")
    private long id;

    @Schema(description = "Glossary term", example = "WLAN")
    private String keyword;

}
