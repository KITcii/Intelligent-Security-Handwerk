package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.dto.recommendation.Severity;
import ish.user.model.asset.Asset;
import ish.user.model.asset.ControlAsset;
import ish.user.model.asset.ControlStatus;
import ish.user.model.knowledge.ControlLevel;
import ish.user.model.knowledge.SecurityControl;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlAssetDTO implements Asset {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Component asset ID", example = "123")
    private long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SecurityControl control;

    @Schema(description = "Control type information", enumAsRef = true)
    private ControlStatus status;

    @Schema(description = "Associated threat severity", enumAsRef = true)
    private Severity severity;

    @Schema(description = "Recommendation flag")
    private boolean recommended;

    @Schema(description = "Implemented guidelines")
    List<Integer> implementedGuidelines = new ArrayList<>();

    @Override
    public long getReferenceId() {
        return control.getId();
    }

    public static ControlAssetDTO from(ControlAsset ca) {
        return from(ca, false);
    }

    public static ControlAssetDTO from(ControlAsset ca, boolean serializeControl) {
        ControlAssetDTO dto = new ControlAssetDTO();
        dto.setId(ca.getId());
        dto.setStatus(ca.getStatus());
        dto.setRecommended(ca.isRecommended());
        dto.setSeverity(ca.getControl().getLevel() == ControlLevel.MUST ? Severity.CRITICAL : Severity.LOW);

        if (serializeControl)
            dto.setControl(ca.getControl());

        if (Objects.nonNull(ca.getImplementedGuidelines()))
            dto.setImplementedGuidelines(ca.getImplementedGuidelines().stream().map(ga -> ga.getGuideline().getPosition()).toList());
        return dto;
    }
}
