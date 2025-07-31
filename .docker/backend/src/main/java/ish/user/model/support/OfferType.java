package ish.user.model.support;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Offer type information", enumAsRef = true)
public enum OfferType {

    @Schema(description = "Training offerings")
    TRAINING,

    @Schema(description = "Consultation offerings")
    CONSULTATION;

}
