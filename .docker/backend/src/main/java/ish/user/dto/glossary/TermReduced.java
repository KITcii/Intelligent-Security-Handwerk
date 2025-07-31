package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.glossary.Term;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Reduced glossary term")
public class TermReduced {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Company ID", example = "123")
    private long id;

    @Schema(description = "Glossary term", example = "WLAN")
    private String keyword;

    @Schema(description = "Short definition", example = "WLAN")
    private String definition;

    public static TermReduced from(Term term) {
       return new TermReduced(term.getId(), term.getKeyword(), term.getDefinition());
    }
}
