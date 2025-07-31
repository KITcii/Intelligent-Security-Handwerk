package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.knowledge.Component;

import java.util.List;

@Schema(description = "DTO supporting light tree structure for component assets")
public class ComponentAssetNodeDTO extends AssetNodeDTO<Component, ComponentAssetDTO, ComponentAssetNodeDTO> {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Override
    public ComponentAssetDTO getAsset() {
        return super.getAsset();
    }

    @Override
    public List<ComponentAssetNodeDTO> getChildren() {
        return super.getChildren();
    }
}
