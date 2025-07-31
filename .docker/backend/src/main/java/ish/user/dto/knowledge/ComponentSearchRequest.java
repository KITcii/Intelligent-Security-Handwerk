package ish.user.dto.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Component search request")
public class ComponentSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Component search criteria", implementation = ComponentSearchCriteria.class)
    private ComponentSearchCriteria searchCriteria;
}
