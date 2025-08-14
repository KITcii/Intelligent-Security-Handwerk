package ish.user.dto.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.KnowledgeNode;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Schema(description = "DTO supporting light tree structure for components and controls")
public class KnowledgeNodeDTO<T extends KnowledgeNode<T>> {

    @Schema(description = "ID")
    private long id;

    @Schema(description = "Name")
    private String name;

    @Schema(description = "Description")
    private String description;

    @Schema(description = "Children")
    private List<KnowledgeNodeDTO<T>> children = new ArrayList<>();

    public static <T extends KnowledgeNode<T>> KnowledgeNodeDTO<T> from(T node) {
        return mapToDTO(node);
    }

    private static <T extends KnowledgeNode<T>> KnowledgeNodeDTO<T> mapToDTO(T node) {
        KnowledgeNodeDTO<T> dto = new KnowledgeNodeDTO<>();
        dto.setId(node.getId());
        dto.setName(node.getName());
        dto.setDescription(node.getDescription());

        List<KnowledgeNodeDTO<T>> children = node.getChildren()
                .stream()
                .map(KnowledgeNodeDTO::mapToDTO)
                .collect(Collectors.toList());

        dto.setChildren(children);
        return dto;
    }
}