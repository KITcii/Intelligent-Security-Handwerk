package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.PageRequest;
import lombok.Data;

@Data
@Schema(description = "Glossary search-by-category request")
public class SearchByCategoryRequest {

    @Schema(description = "Category name", example = "IT Security")
    private String category;

    @Schema(description = "Pagination information", implementation = PageRequest.class)
    private PageRequest pageable;
}
