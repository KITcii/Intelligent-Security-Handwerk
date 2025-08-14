package ish.user.dto.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.ControlLevel;
import ish.user.model.knowledge.ControlType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Search criteria for security controls (all case insensitive)")
public class ControlSearchCriteria {

    @Schema(description = "Single string contained in name", example = "Cloud")
    private String nameLike;

    @Schema(description = "Single string contained in description", example = "Cloud")
    private String descriptionLike;

    @Schema(description = "Long description contains", example = "Cloud")
    private String longDescriptionLike;

    @Schema(description = "Single string contained in label", example = "NET")
    private String labelLike;

    @Schema(description = "Exact string matching control level", example = "MUST")
    private ControlLevel controlLevel;

    @Schema(description = "Exact string matching control type", example = "PREVENTIVE")
    private ControlType controlType;

    @Schema(description = "Single string contained in associated guideline descriptions", example = "Institutionsleitung")
    private String guidelineDescriptionLike;

    @Schema(description = "Name, description, long description, label, and guidelines", example = "Computer")
    private String all;

}
