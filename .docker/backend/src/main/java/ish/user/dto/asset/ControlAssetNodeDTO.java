package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonInclude;
import ish.user.model.knowledge.SecurityControl;

import java.util.List;

public class ControlAssetNodeDTO extends AssetNodeDTO<SecurityControl, ControlAssetDTO, ControlAssetNodeDTO> {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Override
    public ControlAssetDTO getAsset() {
        return super.getAsset();
    }

    @Override
    public List<ControlAssetNodeDTO> getChildren() {
        return super.getChildren();
    }
}
