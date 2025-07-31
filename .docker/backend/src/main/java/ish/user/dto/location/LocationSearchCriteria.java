package ish.user.dto.location;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Location search criteria (all case insensitive)")
public class LocationSearchCriteria {

    @Schema(description = "Postal code", example = "76227")
    private String postalCode;

    @Schema(description = "Town", example = "Durlach")
    private String town;

    @Schema(description = "Postal codes or towns", example = "Durlach")
    private String all;
}
