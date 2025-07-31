package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.knowledge.ComponentSearchCriteria;
import ish.user.model.Company;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Search criteria for component assets (all case insensitive)")
public class ComponentAssetSearchCriteria extends ComponentSearchCriteria {

    /*
    @Schema(description = "Single string contained in name", example = "agish.de")
    private String nameLike;

    @Schema(description = "Single string contained in description", example = "agish.de")
    private String descriptionLike;

    @Schema(description = "Single string contained in long description", example = "agish.de")
    private String longDescriptionLike;

     */

    @Schema(description = "Single alias name", example = "alias1")
    private String alias;

    @Schema(description = "List of alias names", example = "[\"alias1\", \"alias2\"]")
    private List<String> aliases;

    @Schema(description = "Single tag name", example = "tag1")
    private String tag;

    @Schema(description = "List of tag names", example = "[\"tag1\", \"tag2\"]")
    private List<String> tags;

    @Schema(description = "Whether the component has an associated asset", example = "true")
    private Boolean instantiated;

    /*
    @Schema(description = "Name, descriptions", example = "Computer")
    private String all;
     */

    @JsonIgnore
    private Company company;
}
