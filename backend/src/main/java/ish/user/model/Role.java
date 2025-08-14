package ish.user.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Schema(description = "User model information")
@NoArgsConstructor
public class Role {

    @JsonCreator
    public Role(String role) {
        this.label = RoleId.valueOf(role.toUpperCase());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO Make unique
    @Enumerated(EnumType.STRING)
    @Schema(description = "Role ID")
    @Column(unique=true)
    private RoleId label;

    @JsonValue
    public RoleId getLabel() {
        return label;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Role role = (Role) o;
        return label == role.label;
    }

    @Override
    public int hashCode() {
        return label.hashCode();
    }
}