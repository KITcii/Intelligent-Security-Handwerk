package ish.user.model.location;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "counties")
@Schema(description = "County information")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class County {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "State ID", example = "123")
    private long id;

    @Column(name = "name_", nullable = false)
    @Schema(description = "Unique county name", example = "Germany")
    private String name;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "federal_state_id", nullable = false)
    private FederalState state;

    @Schema(description = "County code")
    private String code;
}
