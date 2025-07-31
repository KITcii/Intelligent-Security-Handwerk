package ish.user.model.support;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.location.Location;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "support_providers")
@Schema(description = "Topic information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Topic ID", example = "1")
    private long id;

    @Column(name = "name_")
    @Schema(description = "Topic ID", example = "1")
    private String name;

    @Schema(description = "Topic ID", example = "1")
    private String contactPerson;

    @Schema(description = "Topic ID", example = "1")
    private String street;

    @Schema(description = "Topic ID", example = "1")
    private String streetNumber;

    @Schema(description = "Topic ID", example = "1")
    private String addressDetails;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    @Schema(description = "Location ID", example = "1")
    private Location location;

    @Schema(description = "Topic ID", example = "1")
    private String phone;

    @Schema(description = "Topic ID", example = "1")
    private String mail;

    @Schema(description = "Topic ID", example = "1")
    private String website;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Topic ID", example = "1")
    private String description;


}
