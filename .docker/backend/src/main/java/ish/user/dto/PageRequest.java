package ish.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Objects;

@Data
@Schema(description = "Glossary search request")
public class PageRequest {

    @Schema(description = "Page", example = "0")
    private int page;

    @Schema(description = "Page size", example = "10")
    private int size;

    @Schema(description = "Sort information", ref = "#/components/schemas/SortObject")
    private Sort sort;

    public Pageable toPageable() {
        Sort s = Sort.unsorted();
        if (Objects.nonNull(sort))
            s = sort;

        return org.springframework.data.domain.PageRequest.of(page, size, s);
    }
}
