package ish.user.dto.support;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Education search request")
public class EducationSearchRequest {

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Education search criteria", implementation = EducationSearchCriteria.class)
    private EducationSearchCriteria searchCriteria;

}
