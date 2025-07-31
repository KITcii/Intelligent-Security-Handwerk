package ish.user.dto.assessment;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@Schema(description = "Assessment information")
public class AssessmentDTO {

    @Schema(description = "ID of the corresponding standard element", example = "1")
    private long standardElementId;

    @Schema(description = "Standard element name", example = "1")
    private String name;

    @Schema(description = "Fulfillment degree of relevant controls and their guidelines", example = "0.27")
    private double coverage;

    @Schema(description = "Source website", example = "https://www.bsi.bund.de")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String website;

    @Schema(description = "Assessment grade", enumAsRef = true, example = "GOOD")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Grade grade;

    @Schema(description = "Assessment sub-sections")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<AssessmentDTO> sections;

}
