package ish.user.model.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Control type information", enumAsRef = true)
public enum ControlLevel {

    @Schema(description = "Must-have controls")
    MUST,

    @Schema(description = "Should-have controls")
    SHOULD;
}
