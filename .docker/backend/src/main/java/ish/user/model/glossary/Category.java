package ish.user.model.glossary;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "glossary_categories")
@Schema(description = "Category of a term")
@Getter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Category ID", example = "1")
    private Long id;

    @Column(name = "name_", nullable = false, unique = true)
    @Schema(description = "Unique category name", example = "IT")
    private String name;

    @Column(nullable = false)
    @Schema(description = "Description", example = "The field of managing and processing information using technology.")
    private String description;

}