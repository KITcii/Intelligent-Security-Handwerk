package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.glossary.Category;
import ish.user.model.glossary.Term;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@Schema(description = "Glossary search request")
public class DetailedTermResponse {

    @Schema(description = "Glossary entry", implementation = Term.class)
    Term term;

    @Schema(description = "Associated glossary category", implementation = Category.class)
    Category category;

    // TODO own class
    @Schema(description = "Term references")
    Map<String, TermReduced> references;
}
