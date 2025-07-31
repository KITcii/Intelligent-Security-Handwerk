package ish.user.model.knowledge;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "it_control_threat")
@Schema(description = "Threat information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Threat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Threat ID", example = "123")
    private long id;

    @Column(unique = true)
    @Schema(description = "Threat label", example = "G 0.45")
    private String label;

    @Column(name = "name_")
    @Schema(description = "Threat name", example = "Data loss")
    private String name;

    // TODO add source

}
