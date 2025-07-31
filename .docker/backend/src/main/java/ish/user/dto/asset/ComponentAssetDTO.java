package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.asset.Asset;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.knowledge.Component;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentAssetDTO implements Asset {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Component asset ID", example = "123")
    private long id;

    @JsonIgnore
    private long referenceId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Component component;

    private List<AliasDTO> aliases;

    @Override
    public long getReferenceId() {
        return component.getId();
    }

    public static ComponentAssetDTO from(ComponentAsset ca) {
        return from(ca, false);
    }

    public static ComponentAssetDTO from(ComponentAsset ca, boolean serializeComponent) {
        ComponentAssetDTO dto = new ComponentAssetDTO();
        dto.setId(ca.getId());
        dto.setReferenceId(ca.getComponent().getId());

        if (serializeComponent)
            dto.setComponent(ca.getComponent());

        List<AliasDTO> aliases = ca.getAliases()
                .stream()
                .map(alias -> new AliasDTO(alias.getId(), alias.getAlias(), alias.getCreatedAt(), alias.getTags()))
                .toList();

        dto.setAliases(aliases);
        return dto;
    }

}
