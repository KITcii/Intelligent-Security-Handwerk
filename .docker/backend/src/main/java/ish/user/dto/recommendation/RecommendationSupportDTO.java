package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.support.Listing;
import ish.user.model.support.Topic;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@Schema(description = "Support information related to recommendation")
public class RecommendationSupportDTO {

    @ArraySchema(arraySchema = @Schema(description = "Exact names of associated offers", implementation = Topic.class))
    private Set<Topic> topics;

    @ArraySchema(arraySchema = @Schema(description = "Exact names of associated offers", implementation = Listing.class))
    private List<Listing> listings;
}
