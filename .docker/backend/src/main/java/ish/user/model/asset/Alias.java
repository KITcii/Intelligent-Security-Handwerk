package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Company;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "it_component_alias",
        uniqueConstraints = @UniqueConstraint(columnNames = {"name", "company_id"})
)
@Schema(description = "Alias information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Alias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Alias ID", example = "123")
    private long id;

    @Column(nullable = false)
    @Schema(description = "Alias name", example = "Main Router")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @Schema(description = "Company owning the alias", implementation = Company.class)
    @JsonIgnore
    private Company company;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Alias alias = (Alias) o;
        return id == alias.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
