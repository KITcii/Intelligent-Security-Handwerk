package ish.user.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.StringJoiner;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@Table(name = "users")
//@IdClass(UserId.class)
@Schema(description = "User model information")
@NoArgsConstructor
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "User ID", example = "123")
    private long id;

    @Schema(description = "Mail address", example = "norman.eugene@macdonald.com")
    @Column(unique=true)
    private String mail;

    @Schema(description = "First name", example = "Norman")
    private String firstName;

    @Schema(description = "Last name", example = "MacDonald")
    private String lastName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_to_roles",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @ArraySchema(arraySchema = @Schema(description = "User roles", implementation = Role.class, example = "[\"USER\", \"OWNER\"]"))
    //@JsonDeserialize(contentUsing = RoleDeserializer.class)
    private Set<Role> roles = new HashSet<>();

    @JsonIgnore
    @Schema(description = "Password")
    private String password;

    @Schema(description = "Verification status")
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean verified = false;

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY to avoid unnecessary loading
    @JoinColumn(name = "company_id", nullable = true) // Column in the User table that stores the foreign key
    @Schema(description = "Company", implementation = Company.class)
    private Company company;

    // TODO Nutzerstatus (eingeladen, aktiv)
    // TODO Add user settings

    public User(String mail, String firstName, String lastName) {
        this.mail = mail;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public User(User user) {
        set(user);
    }

    public Set<Role> getRoles() {
        return new HashSet<>(roles);
    }

    public void setRoles(Set<Role> roles) {
        this.roles.clear();
        this.roles.addAll(roles);
    }

    public void set(User user) {
        this.id = user.id;

        if (Objects.nonNull(user.mail))
            this.mail = user.mail;

        if (Objects.nonNull(user.firstName))
            this.firstName = user.firstName;

        if (Objects.nonNull(user.lastName))
            this.lastName = user.lastName;

        if (Objects.nonNull(user.roles))
            this.roles = new HashSet<>(user.roles);
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", User.class.getSimpleName() + "[", "]")
                .add("id=" + id)
                .add("mail='" + mail + "'")
                .add("firstName='" + firstName + "'")
                .add("lastName='" + lastName + "'")
                .add("roles='" + roles + "'")
                .toString();
    }
}
