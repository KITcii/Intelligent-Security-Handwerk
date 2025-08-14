package ish.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.User;
import lombok.Data;

@Data
@Schema(description = "User information")
public class UserDto {

    public static UserDto from(User user) {
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.mail = user.getMail();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
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

    /*
    @JsonIgnore
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Password", example = "string")
    private String password;

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty("password")
    public void setPassword(String password) {
        this.password = password;
    }
     */
}
