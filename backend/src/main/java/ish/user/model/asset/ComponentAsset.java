package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Company;
import ish.user.model.knowledge.Component;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "it_component_asset",
        // Each component can be tied to one asset in the context of a single company
        // For the table the combination of company_id and component_id should be unique
        uniqueConstraints = @UniqueConstraint(columnNames = {"company_id", "component_id"})
)
@Schema(description = "IT component information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentAsset implements Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Component asset ID", example = "123")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    //@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    //@JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore
    private Component component;

    @OneToMany(mappedBy = "componentAsset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Schema(description = "Associations between aliases and tags")
    private List<ComponentAlias> aliases = new ArrayList<>();

    @Override
    public long getReferenceId() {
        return component.getId();
    }
}