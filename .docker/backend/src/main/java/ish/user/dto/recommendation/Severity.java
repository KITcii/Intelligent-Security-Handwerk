package ish.user.dto.recommendation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Threat severity", enumAsRef = true)
public enum Severity {

    LOW,

    MEDIUM,

    HIGH,

    CRITICAL;
}
