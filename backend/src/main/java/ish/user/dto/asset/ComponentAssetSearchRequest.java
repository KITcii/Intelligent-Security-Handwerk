package ish.user.dto.asset;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Component asset search request")
public class ComponentAssetSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Component asset search criteria", implementation = ComponentAssetSearchCriteria.class)
    private ComponentAssetSearchCriteria searchCriteria;
}
