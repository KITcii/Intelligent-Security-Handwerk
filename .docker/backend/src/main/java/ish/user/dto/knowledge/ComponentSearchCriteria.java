package ish.user.dto.knowledge;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Search criteria for components (all case insensitive)")
public class ComponentSearchCriteria {

    @Schema(description = "Single string contained in name", example = "Cloud")
    private String nameLike;

    @Schema(description = "Single string contained in description", example = "Cloud")
    private String descriptionLike;

    @Schema(description = "Single string contained in long description", example = "Cloud")
    private String longDescriptionLike;

    @Schema(description = "Name, descriptions", example = "Computer")
    private String all;

}
