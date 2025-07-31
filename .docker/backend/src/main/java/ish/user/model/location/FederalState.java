package ish.user.model.location;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "federal_states")
@Schema(description = "Federal state information")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FederalState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "State ID", example = "123")
    private long id;

    @Column(name = "name_", nullable = false)
    @Schema(description = "Federal state name", example = "Berlin")
    private String name;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Schema(description = "Federal state code")
    private String code;
}
