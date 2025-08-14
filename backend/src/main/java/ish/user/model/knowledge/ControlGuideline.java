package ish.user.model.knowledge;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "it_control_guidelines")
@Schema(description = "Security control guideline information")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlGuideline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private long id;

    @Column(nullable = false)
    @Schema(description = "Position of guideline within security control (one-based index)")
    private int position;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    @Schema(description = "Guideline description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_id", nullable = false)
    @JsonIgnore
    @Schema(description = "Security control associated with guideline")
    private SecurityControl control;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ControlGuideline that = (ControlGuideline) o;

        if (id != that.id) return false;
        return position == that.position;
    }

    @Override
    public int hashCode() {
        int result = (int) (id ^ (id >>> 32));
        result = 31 * result + position;
        return result;
    }
}
