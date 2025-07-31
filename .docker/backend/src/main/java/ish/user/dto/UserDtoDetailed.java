package ish.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.Role;
import ish.user.model.User;
import lombok.Data;

import java.util.Set;

@Data
@Schema(description = "User information")
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDtoDetailed {

    public static UserDtoDetailed from(User user) {
        UserDtoDetailed dto = new UserDtoDetailed();
        dto.id = user.getId();
        dto.mail = user.getMail();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
        dto.roles = user.getRoles();
        dto.verified = user.isVerified();
        dto.company = CompanyDto.from(user.getCompany());
        return dto;
    }

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "User ID", example = "123")
    private long id;

    @Schema(description = "Mail address", example = "norman.eugene@macdonald.com")
    private String mail;

    @Schema(description = "First name", example = "Norman")
    private String firstName;

    @Schema(description = "Last name", example = "MacDonald")
    private String lastName;

    @ArraySchema(arraySchema = @Schema(description = "User roles", implementation = Role.class, example = "[\"USER\", \"OWNER\"]"))
    private Set<Role> roles;

    @Schema(description = "Verification status")
    private boolean verified = false;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Company information")
    private CompanyDto company;
}