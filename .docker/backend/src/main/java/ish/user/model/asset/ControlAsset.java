package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Company;
import ish.user.model.knowledge.ControlGuideline;
import ish.user.model.knowledge.SecurityControl;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "it_control_asset",
        // Each control can be tied to one asset in the context of a single company
        // For the table the combination of company_id and control_id should be unique
        uniqueConstraints = @UniqueConstraint(columnNames = {"company_id", "control_id"})
)
@Schema(description = "IT component information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlAsset implements Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Control asset ID", example = "123")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_id", nullable = false)
    @JsonIgnore
    private SecurityControl control;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Control type information", enumAsRef = true)
    private ControlStatus status;

    @OneToMany(mappedBy = "controlAsset", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    List<GuidelineAsset> implementedGuidelines = new ArrayList<>();

    @Schema(description = "Recommendation status")
    private boolean recommended = false;

    @Override
    public long getReferenceId() {
        return control.getId();
    }
}
