package ish.user.repository.asset;

import ish.user.model.asset.Alias;
import ish.user.model.asset.ComponentAlias;
import ish.user.model.asset.ComponentAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComponentAliasRepository extends JpaRepository<ComponentAlias, Long> {

    Optional<ComponentAlias> findByComponentAssetAndAlias(ComponentAsset componentAsset, Alias alias);

    boolean existsByComponentAssetAndAlias(ComponentAsset componentAsset, Alias alias);
}
