package ish.user.model.asset;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Control type information", enumAsRef = true)
public enum ControlStatus {

    @Schema(description = "Control was recommended but no guidelines have been implemented")
    OPEN,

    @Schema(description = "Control was recommended but is deemed irrelevant")
    IRRELEVANT,

    @Schema(description = "Some guidelines have been implemented")
    IN_PROCESS,

    @Schema(description = "All guidelines have been implemented")
    IMPLEMENTED;
}
