package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.ControlGuideline;
import ish.user.model.knowledge.ControlLevel;
import ish.user.model.knowledge.SecurityControl;
import ish.user.model.knowledge.Threat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Recommendation information")
public class RecommendationDTO {

    @Schema(description = "Control ID")
    private long controlID;

    @Schema(description = "Recommendation name")
    private String name;

    @Schema(description = "Recommendation text")
    private String text;

    @Schema(description = "Recommendation reason")
    private String reason;

    @Schema(description = "Recommendation explanation")
    private String explanation;

    @Schema(description = "Recommendation threat severity")
    private Severity severity;

    @Schema(description = "Control guidelines")
    private List<ControlGuideline> guidelines;

    @ArraySchema(arraySchema = @Schema(description = "Information sources", implementation = Threat.class))
    private List<Threat> threats;

    public static RecommendationDTO from(SecurityControl control) {
        RecommendationDTO dto = new RecommendationDTO();
        dto.controlID = control.getId();
        dto.name = control.getName();
        dto.text = control.getDescription();
        dto.reason = control.getLongDescription();

        // TODO fix explanation
        dto.explanation = "This is an explanation";

        dto.severity = control.getLevel() == ControlLevel.MUST ? Severity.CRITICAL : Severity.LOW;
        dto.guidelines = control.getGuidelines();
        dto.threats = control.getThreats();
        return dto;
    }

}
