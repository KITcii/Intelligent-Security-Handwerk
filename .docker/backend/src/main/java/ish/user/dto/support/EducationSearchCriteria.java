package ish.user.dto.support;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.support.OfferType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Search criteria for listing (all case insensitive)")
public class EducationSearchCriteria {

    @ArraySchema(arraySchema = @Schema(description = "Multiple strings contained in website", example = "[\"agish.de\", \"hvid.de\"]"))
    private List<String> websitesLike;

    @Schema(description = "Single string contained in website", example = "agish.de")
    private String websiteLike;

    @ArraySchema(arraySchema = @Schema(description = "Exact names of associated providers", example = "[\"Akademie für Cyber-Sicherheit im Handwerk (ACSH)\", \"Allianz für Sichere Handwerksbetriebe (ASH)\"]"))
    private List<String> providerNames;

    @ArraySchema(arraySchema = @Schema(description = "Alike names of associated providers", example = "[\"(acsh)\", \"(ash)\"]"))
    private List<String> providerNamesLike;

    @Schema(description = "Single, alike name of associated providers", example = "(acsh)")
    private String providerNameLike;

    @ArraySchema(arraySchema = @Schema(description = "Exact names of associated offers", example = "[\"cloud\"]"))
    private List<String> offerNames;

    @Schema(description = "Single, alike name of associated offer", example = "cloud")
    private String offerNameLike;

    @Schema(description = "Exact type of associated offer", example = "TRAINING")
    private OfferType offerType;

    @ArraySchema(arraySchema = @Schema(description = "Alike names of associated topics", example = "[\"cloud\", \"e-mail\"]"))
    private List<String> topicNamesLike;

    @Schema(description = "Single, alike name of associated topic", example = "cloud")
    private String topicNameLike;

    @ArraySchema(arraySchema = @Schema(description = "Alike descriptions of associated offers", example = "[\"bedrohungen\"]"))
    private List<String> offerDescriptionsLike;

    @Schema(description = "Single, alike description of associated offer", example = "bedrohungen")
    private String offerDescriptionLike;

    @ArraySchema(arraySchema = @Schema(description = "Alike descriptions of associated topics", example = "[\"planung\"]"))
    private List<String> topicDescriptionsLike;

    @Schema(description = "Single, alike description of associated topics", example = "planung")
    private String topicDescriptionLike;
}
