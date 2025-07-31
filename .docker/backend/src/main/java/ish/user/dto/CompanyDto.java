package ish.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Company;
import ish.user.model.CompanyType;
import ish.user.model.Profession;
import ish.user.model.location.Location;
import lombok.Data;

import java.util.Optional;


@Data
@Schema(description = "Company information")
public class CompanyDto {

    public static CompanyDto from(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.name = Optional.ofNullable(company.getName());
        dto.profession = Optional.ofNullable(company.getProfession());
        dto.companyType = Optional.ofNullable(company.getCompanyType());
        dto.location = Optional.ofNullable(company.getLocation());
        dto.locationId = Optional.ofNullable(company.getLocation()).map(Location::getId);
        return dto;
    }

    @Schema(description = "Organisation name", example = "Construction GmbH")
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    private Optional<String> name;

    @Schema(description = "Profession")
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    private Optional<Profession> profession;

    @Schema(description = "Company type")
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    private Optional<CompanyType> companyType;

    @JsonIgnore
    @Schema(hidden = true)
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    private Optional<Location> location;

    @JsonIgnore
    @Schema(hidden = true)
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    private Optional<Long> locationId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Company location (view only)", accessMode = Schema.AccessMode.READ_ONLY)
    public Optional<Location> getLocation() {
        return location;
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Schema(accessMode = Schema.AccessMode.WRITE_ONLY, description = "Location ID", example = "2174")
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    public void setLocationId(Optional<Long> locationId) {
        this.locationId = locationId;
    }
}
