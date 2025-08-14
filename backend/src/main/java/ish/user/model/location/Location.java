package ish.user.model.location;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locations")
@Schema(description = "Location information")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Location ID", example = "123")
    private long id;

    @Column(name = "name_", nullable = false)
    @Schema(description = "Location name", example = "Durlach")
    private String name;

    @Schema(description = "Postal code", example = "76227")
    private String postalCode;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "county_id", nullable = false)
    private County county;

}
