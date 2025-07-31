package ish.user.model.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Control type information", enumAsRef = true)
public enum ControlType {

    @Schema(description = "Actions taken to fix or mitigate the impact of a detected issue or breach (e.g., restoring from backups)")
    CORRECTIVE,

    @Schema(description = "Measures designed to identify and detect security incidents or unauthorized activities (e.g., intrusion detection systems)")
    DETECTIVE,

    @Schema(description = "Measures aimed at discouraging potential attackers from attempting breaches (e.g., security cameras, warning signs)")
    DETERRENT,

    @Schema(description = "Proactive measures to stop security incidents before they occur (e.g., firewalls, access controls)")
    PREVENTIVE;
}
