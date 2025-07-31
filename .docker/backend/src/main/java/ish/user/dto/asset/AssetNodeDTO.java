package ish.user.dto.asset;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.asset.ComponentAsset;
import ish.user.model.asset.ControlAsset;
import ish.user.model.knowledge.Component;
import ish.user.model.knowledge.KnowledgeNode;
import ish.user.model.asset.Asset;
import ish.user.model.knowledge.SecurityControl;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
@Schema(description = "DTO supporting light tree structure for component and control assets")
public abstract class AssetNodeDTO<NODE extends KnowledgeNode<NODE>, ASSET, SELF extends AssetNodeDTO<NODE, ASSET, SELF>> {

    @Schema(description = "ID")
    private long id;

    @Schema(description = "Name")
    private String name;

    @Schema(description = "Description")
    private String description;

    @Schema(description = "Asset information")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    protected ASSET asset;

    @Schema(description = "Children")
    private List<SELF> children = new ArrayList<>();

    public static ComponentAssetNodeDTO fromComponent(Component node, List<ComponentAsset> assets) {
        Function<Component, ComponentAssetNodeDTO> constructor = n -> {
            ComponentAssetNodeDTO dto = new ComponentAssetNodeDTO();
            dto.setId(n.getId());
            dto.setName(n.getName());
            dto.setDescription(n.getDescription());
            return dto;
        };
        return from(node, assets, ComponentAssetDTO::from, constructor);
    }

    public static ControlAssetNodeDTO fromControl(SecurityControl node, List<ControlAsset> assets) {
        Function<SecurityControl, ControlAssetNodeDTO> constructor = n -> {
            ControlAssetNodeDTO dto = new ControlAssetNodeDTO();
            dto.setId(n.getId());
            dto.setName(n.getName());
            dto.setDescription(n.getDescription());
            return dto;
        };
        return from(node, assets, ControlAssetDTO::from, constructor);
    }

    public static <NODE extends KnowledgeNode<NODE>,
            ASSET_TO,
            ASSET_FROM extends Asset,
            RETURN_TYPE extends AssetNodeDTO<NODE, ASSET_TO, RETURN_TYPE>> RETURN_TYPE from(NODE node,
                                                                                            List<ASSET_FROM> assets,
                                                                                            Function<ASSET_FROM, ASSET_TO> mapper,
                                                                                            Function<NODE, RETURN_TYPE> constructor) {
        Map<Long, ASSET_FROM> assetMap = assets.stream().collect(Collectors.toMap(Asset::getReferenceId, Function.identity()));
        return mapToDTO(node, assetMap, mapper, constructor);
    }

    private static <NODE extends KnowledgeNode<NODE>,
            ASSET_TO,
            ASSET_FROM extends Asset,
            RETURN_TYPE extends AssetNodeDTO<NODE, ASSET_TO, RETURN_TYPE>> RETURN_TYPE mapToDTO(NODE node,
                                                                                                Map<Long, ASSET_FROM> assetMap,
                                                                                                Function<ASSET_FROM, ASSET_TO> mapper,
                                                                                                Function<NODE, RETURN_TYPE> constructor) {
        RETURN_TYPE dto = constructor.apply(node);

        ASSET_FROM asset = assetMap.get(node.getId());
        if (Objects.nonNull(asset))
            dto.setAsset(mapper.apply(asset));

        List<RETURN_TYPE> children = node.getChildren()
                .stream()
                .map(child -> mapToDTO(child, assetMap, mapper, constructor))
                .collect(Collectors.toList());

        dto.setChildren(children);
        return dto;
    }

}
