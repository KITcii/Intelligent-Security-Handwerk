package ish.user.dto.asset;

import ish.user.model.asset.Alias;
import ish.user.model.asset.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AliasDTO {

    private long instanceId;

    private long aliasId;

    private String alias;

    private LocalDateTime createdAt;

    private List<Tag> tags;

    public AliasDTO(long componentAliasId, Alias alias, LocalDateTime createdAt, List<Tag> tags) {
        this.instanceId = componentAliasId;
        this.aliasId = alias.getId();
        this.alias = alias.getName();
        this.createdAt = createdAt;
        this.tags = tags;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AliasDTO aliasDTO = (AliasDTO) o;

        return instanceId == aliasDTO.instanceId;
    }

    @Override
    public int hashCode() {
        return (int) (instanceId ^ (instanceId >>> 32));
    }
}
