package ish.user.model.knowledge;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "it_component")
@Schema(description = "IT component information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Component implements KnowledgeNode<Component> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Component ID", example = "123")
    private long id;

    @Column(name = "name_")
    @Schema(description = "Component name")
    private String name;

    @Column(columnDefinition = "TEXT", nullable = true)
    @Schema(description = "Component description (short)")
    private String description;

    // TODO keep only description
    @Column(columnDefinition = "TEXT", nullable = true)
    @Schema(description = "Componet description (long)")
    private String longDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    @JsonIdentityReference(alwaysAsId = true)
    @Schema(description = "Parent component", example = "WLAN")
    private Component parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIdentityReference(alwaysAsId = true)
    @ArraySchema(schema = @Schema(description = "Child components"))
    private List<Component> children = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "it_component_controls",
            joinColumns = @JoinColumn(name = "component_id"),
            inverseJoinColumns = @JoinColumn(name = "control_id")
    )
    //@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    //@JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore
    @ArraySchema(schema = @Schema(description = "Related controls"))
    private List<SecurityControl> relatedControls;
}
