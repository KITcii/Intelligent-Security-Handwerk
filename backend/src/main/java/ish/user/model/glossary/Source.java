package ish.user.model.glossary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "glossary_sources")
@Data
@Schema(description = "Source or resource associated with a glossary term")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Source ID", example = "1")
    private long id;

    @Schema(description = "Name of the source or resource", example = "IT-Grundschutz-Kompendium, Edition 2023, Glossar")
    @Column(name = "name_", nullable = false, length = 1000)
    private String name;

    @Schema(description = "URL of the source or resource", example = "https://www.bsi.bund.de")
    @Column(nullable = false, length = 3000)
    private String url;

    @Schema(description = "Type of the entry", example = "SOURCE")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_", nullable = false)
    private SourceType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    @JsonIgnore // Avoid circular reference during serialization
    private Term term;

    public enum SourceType {
        SOURCE,
        RESOURCE
    }
}
