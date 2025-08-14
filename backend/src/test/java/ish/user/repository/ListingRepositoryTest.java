package ish.user.repository;

import ish.user.model.support.Listing;
import ish.user.model.support.OfferType;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

@DataJpaTest
@Sql({"/location-test.sql", "/support-test.sql"})
class ListingRepositoryTest {

    @Autowired
    private ListingRepository repository;

    @Test
    void testFindByWebsiteContainingIgnoreCase() {
        String website = "agish.de";
        List<Listing> listings = repository.findByWebsiteContainingIgnoreCase(website);
        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getWebsite().toLowerCase().contains(website));
    }

    @Test
    void testFindByOfferType() {
        OfferType type = OfferType.TRAINING;
        List<Listing> listings = repository.findByOfferType(type);
        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getOffer().getType() == type);
    }

}