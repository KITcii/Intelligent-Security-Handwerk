package ish.user.dto.glossary;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Glossary search criteria (all case insensitive)")
public class SearchCriteria {

    @ArraySchema(arraySchema = @Schema(description = "IDs", example = "[\"1\", \"2\"]"))
    private List<String> ids;

    @Schema(description = "ID", example = "1")
    private String id;

    @ArraySchema(arraySchema = @Schema(description = "Multiple strings contained in keywords", example = "[\"echnology\", \"ecurity\"]"))
    private List<String> keywordsLike;

    @Schema(description = "Single string contained in keywords", example = "echnology")
    private String keywordLike;

    @ArraySchema(arraySchema = @Schema(description = "Exact keywords", example = "[\"technology\", \"security\"]"))
    private List<String> keywords;

    @Schema(description = "Exact keyword", example = "technology")
    private String keyword;

    @ArraySchema(arraySchema = @Schema(description = "Exact categories", example = "[\"basics\", \"cyberattacks\"]"))
    private List<String> categories;

    @Schema(description = "Exact category", example = "basics")
    private String category;

    @ArraySchema(arraySchema = @Schema(description = "Multiple strings contained in synonyms", example = "[\"echnology\", \"ecurity\"]"))
    private List<String> synonymsLike;

    @Schema(description = "Single string contained in synonyms", example = "echnology")
    private String synonymLike;

    @ArraySchema(arraySchema = @Schema(description = "Exact synonyms", example = "[\"technology\", \"security\"]"))
    private List<String> synonyms;

    @Schema(description = "Exact synonym", example = "technology")
    private String synonym;

    @ArraySchema(arraySchema = @Schema(description = "Multiple strings contained in keywords or synonyms", example = "[\"echnology\", \"ecurity\"]"))
    private List<String> keywordsOrSynonyms;

    @Schema(description = "Keywords, definitions, descriptions, or synonyms", example = "echnology")
    private String all;
}
