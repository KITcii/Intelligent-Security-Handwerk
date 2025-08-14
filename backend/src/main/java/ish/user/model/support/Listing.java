package ish.user.model.support;

import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.glossary.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "support_listing")
@Schema(description = "Offer provided by provider")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Offer service ID", example = "1")
    private long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "offer_id", nullable = false)
    @Schema(description = "Provided offer", implementation = Category.class)
    private Offer offer;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    @Schema(description = "Provider", implementation = Category.class)
    private Provider provider;

    @Schema(description = "Website", implementation = Category.class)
    private String website;
}
