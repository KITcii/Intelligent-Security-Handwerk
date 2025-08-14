package ish.user.dto.assessment;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Assessment grades", enumAsRef = true)
public enum Grade {

    VERY_GOOD,

    GOOD,

    SATISFACTORY,

    SUFFICIENT,

    INSUFFICIENT;


}
