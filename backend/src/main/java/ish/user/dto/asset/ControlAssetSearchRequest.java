package ish.user.dto.asset;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Security control asset search request")
public class ControlAssetSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Control asset search criteria", implementation = ControlAssetSearchCriteria.class)
    private ControlAssetSearchCriteria searchCriteria;
}
