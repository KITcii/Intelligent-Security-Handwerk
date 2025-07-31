package ish.user.model.asset;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface Asset {

    @JsonIgnore
    long getReferenceId();
}
