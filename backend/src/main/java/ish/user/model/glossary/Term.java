package ish.user.model.glossary;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;


@Entity
@Table(name = "glossary")
@Schema(description = "Glossary term")
@Getter
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Company ID", example = "123")
    private long id;

    @Schema(description = "Glossary term", example = "WLAN")
    private String keyword;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Short definition", example = "WLAN")
    private String definition;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Long description", example = "WLAN (Wireless Local Area Network) refers to a type of local area network that allows devices to connect and communicate wirelessly.")
    private String description;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true) // Ensures only the ID is serialized
    @Schema(description = "Category of the term", implementation = Category.class)
    private Category category;

    // Use @ElementCollection to map synonyms to a separate table
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "glossary_synonyms", joinColumns = @JoinColumn(name = "term_id"))
    @Column(name = "synonym")
    @ArraySchema(schema = @Schema(description = "Glossary term synonyms", example = "[\"Wireless LAN\", \"Wi-Fi\"]"))
    private List<String> synonyms;

    @OneToMany(mappedBy = "term", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Schema(description = "Associated sources or resources for the glossary entry")
    private List<Source> sources = new ArrayList<>();

    @CreationTimestamp
    @Schema(description = "Create time", example = "2024-07-03T10:15:30")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Schema(description = "Update time", example = "2007-08-03T10:15:30")
    private LocalDateTime updatedAt;

    @Override
    public String toString() {
        return new StringJoiner(", ", Term.class.getSimpleName() + "[", "]")
                .add("keyword='" + keyword + "'")
                .add("synonyms=" + synonyms)
                .toString();
    }
}
