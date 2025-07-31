package ish.user.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.Schema;
import ish.user.model.location.Location;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@Table(name = "companies")
@Schema(description = "Company model information")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Company ID", example = "123")
    private long id;

    @Schema(description = "Organisation name", example = "Construction GmbH")
    private String name;

    @OneToOne
    @JoinColumn(name = "owner_id", nullable = true) // Allow null value, since owner and company have circular referencess
    //@OnDelete(action = OnDeleteAction.CASCADE) // Not necessary, since orphanRemoval is set to true on users
    private User owner;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Schema(description = "Users")
    @Builder.Default
    private List<User> users = new ArrayList<>();

    //@ManyToOne(cascade = CascadeType.PERSIST)
    //@JoinTable(name = "companies_to_industries",
    //        joinColumns = @JoinColumn(name="company_id"),
    //        inverseJoinColumns = @JoinColumn(name="industry_id"))
    //@Schema(description = "Industry")
    //private Industry industry;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profession_id")
    private Profession profession;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Company type")
    private CompanyType companyType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    @Schema(description = "Location")
    private Location location;

    /*
    @Schema(description = "Address")
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name="streetName", column=@Column(name = "STREET")),
            @AttributeOverride(name="houseNumber", column=@Column(name = "HOUSE_NO")),
            @AttributeOverride(name="postalCode", column=@Column(name = "POSTAL_CODE")),
            @AttributeOverride(name="city", column=@Column(name = "CITY")),
            @AttributeOverride(name="country", column=@Column(name = "COUNTRY"))
    })
    private Address address;
     */

    // TODO Add tags to infrastructure aliases
    // TODO Add IT infrastructure

    // TODO Add IT measures

    // TODO Add company settings (boolean option zum ausschließen von analyse, boolean email notifications, string notification mail address)

    public List<User> getUsers() {
        return new ArrayList<>(users);
    }

    public void setUsers(List<User> users) {
        this.users.clear();
        this.users.addAll(users);
    }

    public void set(Company company) {
        this.id = company.id;

        if (Objects.nonNull(company.name))
            this.name = company.name;

        if (Objects.nonNull(company.profession))
            this.profession = company.profession;

        if (Objects.nonNull(company.companyType))
            this.companyType = company.companyType;

        if (Objects.nonNull(company.location))
            this.location = company.location;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", Company.class.getSimpleName() + "[", "]")
                .add("id=" + id)
                .add("name='" + name + "'")
                .add("owner=" + Optional.of(owner).map(User::getId).orElse(-1L))
                .add("profession=" + profession)
                .add("companyType=" + companyType)
                .add("location=" + location)
                .toString();
    }

    /*
    @Embeddable
    public static class Address {

        @Schema(description = "Street name", example = "Kaiserstr.")
        private String streetName;

        @Schema(description = "House Number", example = "89")
        private String houseNumber;

        @Schema(description = "Postal code", example = "76133")
        private String postalCode;

        @Schema(description = "City", example = "Karlsruhe")
        private String city;

        @Schema(description = "Country", example = "Germany")
        private String country;

    }
     */
}
