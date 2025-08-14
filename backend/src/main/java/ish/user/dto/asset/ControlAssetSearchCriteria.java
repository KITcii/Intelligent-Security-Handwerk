package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.knowledge.ControlSearchCriteria;
import ish.user.model.Company;
import ish.user.model.asset.ControlStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Search criteria for security control assets (all case insensitive)")
public class ControlAssetSearchCriteria extends ControlSearchCriteria {

    /*
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

    @Schema(description = "Single string contained in associated guideline descriptions", example = "agish.de")
    private String guidelineDescriptionLike;

     */

    @Schema(description = "Control asset status")
    private ControlStatus status;

    @Schema(description = "Control asset status")
    Set<ControlStatus> statusSet;

    @Schema(description = "Has associated asset")
    private Boolean instantiated;

    /*
    @Schema(description = "Name, description, long description, label, and guidelines", example = "Computer")
    private String all;
     */

    @JsonIgnore
    private Company company;

}
