package ish.user.dto.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Security control search request")
public class ControlSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Control search criteria", implementation = ControlSearchCriteria.class)
    private ControlSearchCriteria searchCriteria;
}
