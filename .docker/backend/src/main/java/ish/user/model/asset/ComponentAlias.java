package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "it_component_asset_alias")
@Schema(description = "Manages aliases for component assets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_asset_id", nullable = false)
    @JsonIgnore
    private ComponentAsset componentAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alias_id", nullable = false)
    private Alias alias;

    @ManyToMany
    @JoinTable(
            name = "it_component_asset_alias_tags",
            joinColumns = @JoinColumn(name = "asset_alias_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @CreationTimestamp
    @Schema(description = "Create time", example = "2024-07-03T10:15:30")
    private LocalDateTime createdAt;
}