package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Profession;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Recommendation statistic information")
public class StatisticDTO {

    @Schema(description = "Profession information")
    private Profession profession;

    @Schema(description = "Percentage of companies with same profession that implement control")
    private double percent;

}
