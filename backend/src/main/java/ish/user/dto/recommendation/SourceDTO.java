package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Source information")
public class SourceDTO {

    @Schema(description = "Source name", example = "BSI IT-Grundschutz")
    private String name;

    @Schema(description = "Control label", example = "ORP.3.A1")
    private String label;

    @Schema(description = "Source URL", example = "https://www.bsi.bund.de")
    private String url;

}
