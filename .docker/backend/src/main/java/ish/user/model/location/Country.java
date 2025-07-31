package ish.user.model.location;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "countries")
@Schema(description = "Country information")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Country ID", example = "123")
    private long id;

    @Column(name = "name_", nullable = false, unique = true)
    @Schema(description = "Unique country name", example = "Germany")
    private String name;

    @Schema(description = "Country code", example = "DE")
    private String code;
}
