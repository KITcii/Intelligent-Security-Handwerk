package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Glossary search request")
public class GlossarySearchRequest {

    //@Schema(description = "Pagination information", ref = "#/components/schemas/PageableObject")
    //private Pageable pageable;
    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;

    @Schema(description = "Glossary search criteria", implementation = SearchCriteria.class)
    private SearchCriteria searchCriteria;

}
