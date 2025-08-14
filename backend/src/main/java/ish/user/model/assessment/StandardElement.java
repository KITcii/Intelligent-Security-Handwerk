package ish.user.model.assessment;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.KnowledgeNode;
import ish.user.model.knowledge.SecurityControl;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "security_standard")
@Schema(description = "Security-standard coverage information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StandardElement implements KnowledgeNode<StandardElement> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Control ID", example = "123")
    private long id;

    @Column(name = "name_")
    @Schema(description = "Security-standard element name (root node has name of standard)")
    private String name;

    @Schema(description = "Security-standard element name (root node has name of standard)")
    private String website;

    @Column(columnDefinition = "TEXT", nullable = true)
    @Schema(description = "Standard element description")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "security_standard_controls",
            joinColumns = @JoinColumn(name = "element_id"),
            inverseJoinColumns = @JoinColumn(name = "control_id")
    )
    @JsonSerialize(using = SecurityControlNameSerializer.class)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @Schema(description = "Security control associated with standard element")
    private List<SecurityControl> controls;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Parent control")
    private StandardElement parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @ArraySchema(schema = @Schema(description = "Child elements"))
    private List<StandardElement> children = new ArrayList<>();
}
