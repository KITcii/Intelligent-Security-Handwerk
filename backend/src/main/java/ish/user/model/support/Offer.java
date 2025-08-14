package ish.user.model.support;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "support_offers")
@Schema(description = "Offer information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Topic ID", example = "1")
    private long id;

    @Column(name = "name_")
    @Schema(description = "Offer name", example = "IT Security 101")
    private String name;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Offer type", example = "Training")
    private OfferType type;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Offer description")
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "support_offer_topics", // Custom join table name
            joinColumns = @JoinColumn(name = "offer_id"), // FK to Offer
            inverseJoinColumns = @JoinColumn(name = "topic_id") // FK to Topic
    )
    @Schema(description = "List of topics related to the offering")
    private List<Topic> topics;

}
