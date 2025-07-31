package ish.user.dto.location;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Location search request")
public class LocationSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Location search criteria", implementation = LocationSearchCriteria.class)
    private LocationSearchCriteria searchCriteria;

}
