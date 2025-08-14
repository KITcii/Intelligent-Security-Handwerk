package ish.user.model.knowledge;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
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
@Table(name = "it_control")
@Schema(description = "Security measure information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityControl implements KnowledgeNode<SecurityControl> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Control ID", example = "123")
    private long id;

    @Column(name = "name_")
    @Schema(description = "Control name")
    private String name;

    @Column(columnDefinition = "TEXT", nullable = true)
    @Schema(description = "Control description (short)")
    private String description;

    // TODO keep only description
    @Column(columnDefinition = "TEXT", nullable = true)
    @Schema(description = "Control description (long)", example = "WLAN")
    private String longDescription;

    @Schema(description = "Control label or foreign identifier")
    private String label;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Control level")
    private ControlLevel level;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Control type")
    private ControlType type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    @JsonIdentityReference(alwaysAsId = true)
    @Schema(description = "Parent control")
    private SecurityControl parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIdentityReference(alwaysAsId = true) // needs to be commented, in order to also serialize children
    @ArraySchema(schema = @Schema(description = "Child controls"))
    private List<SecurityControl> children = new ArrayList<>();

    @OneToMany(mappedBy = "control", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    @ArraySchema(schema = @Schema(description = "Control guidelines"))
    private List<ControlGuideline> guidelines = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "it_control_threat_map",
            joinColumns = @JoinColumn(name = "control_id"),
            inverseJoinColumns = @JoinColumn(name = "threat_id")
    )
    //@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    //@JsonIdentityReference(alwaysAsId = true)
    @ArraySchema(schema = @Schema(description = "Associated threats"))
    private List<Threat> threats;

}
