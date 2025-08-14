package ish.user.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

// https://www.destatis.de/DE/Methoden/Klassifikationen/Gueter-Wirtschaftsklassifikationen/klassifikation-wz-2008.html
@Entity
@Table(name = "industries")
@Schema(description = "Representation of economic sector")
@Data
@AllArgsConstructor
@Builder
public class Industry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Industry ID", example = "123")
    private long id;

    @Schema(description = "Industry name", example = "Electrical Installation")
    private String name;

    @Schema(description = "Industry area", example = "Construction")
    private String area;

    @Schema(description = "Industry subarea", example = "Interior construction")
    private String subarea;

    public Industry() {
    }

}
