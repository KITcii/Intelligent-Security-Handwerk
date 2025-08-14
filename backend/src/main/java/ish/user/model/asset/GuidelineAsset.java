package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.ControlGuideline;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "it_control_asset_guideline")
@Schema(description = "Represents a guideline implemented as part of a control asset")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuidelineAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Guideline asset ID", example = "123")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_asset_id", nullable = false)
    @JsonIgnore
    private ControlAsset controlAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guideline_id", nullable = false)
    @Schema(description = "Associated guideline", implementation = ControlGuideline.class)
    private ControlGuideline guideline;

    public static GuidelineAsset from(ControlAsset ca, ControlGuideline guideline) {
        GuidelineAsset ga = new GuidelineAsset();
        ga.setControlAsset(ca);
        ga.setGuideline(guideline);
        return ga;
    }

    /*
    @Enumerated(EnumType.STRING)
    @Schema(description = "Implementation status of the guideline", example = "IN_PROGRESS", enumAsRef = true)
    private GuidelineStatus status;

    public enum GuidelineStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED
    }
     */
}