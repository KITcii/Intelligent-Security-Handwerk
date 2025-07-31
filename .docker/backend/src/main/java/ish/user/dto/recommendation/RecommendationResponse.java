package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.asset.ComponentAssetDTO;
import ish.user.dto.asset.ControlAssetDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Schema(description = "Recommendation response")
public class RecommendationResponse {

    @Schema(description = "Recommendation information")
    private RecommendationDTO recommendation;

    @Schema(description = "State information of related control")
    private ControlAssetDTO state;

    @ArraySchema(arraySchema = @Schema(description = "Exact names of associated offers", implementation = ComponentAssetDTO.class))
    private List<ComponentAssetDTO> components;

    @ArraySchema(arraySchema = @Schema(description = "Information sources", implementation = SourceDTO.class))
    private List<SourceDTO> sources;

    @Schema(description = "Related statistic")
    private StatisticDTO statistic;

    @Schema(description = "Related support information")
    private RecommendationSupportDTO support;
}
