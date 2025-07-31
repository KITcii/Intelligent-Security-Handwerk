package ish.user.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professions")
@Schema(description = "Profession information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Profession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Profession ID", example = "123")
    private long id;

    @Column(name = "name_", nullable = false)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Profession name")
    private String name;
}
