package ish.user.service;

import ish.user.dto.support.EducationSearchCriteria;
import ish.user.model.support.Listing;
import ish.user.model.support.OfferType;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@SpringBootTest
// Spring Framework 6.1 supports BEFORE_TEST_CLASS as execution phase
//@Sql(scripts = {"/location-test.sql", "/support-test.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
public class ListingServiceTest {

    @Autowired
    private ListingService listingService;

    @BeforeAll
    static void loadTestData(@Autowired JdbcTemplate jdbcTemplate) throws IOException {
        String locationSql = Files.readString(new ClassPathResource("location-test.sql").getFile().toPath());
        jdbcTemplate.execute(locationSql);

        String educationSql = Files.readString(new ClassPathResource("support-test.sql").getFile().toPath());
        jdbcTemplate.execute(educationSql);
    }

    @Test
    void testContextLoads() {
        Assertions.assertThat(listingService).isNotNull();
    }

    @Test
    void testFindByCriteriaWithEmptySpecification() {
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).size().isEqualTo(123);
    }

    @Test
    void testFindByCriteriaWithWebsite() {
        String website = "agish.de";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .websiteLike(website)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getWebsite().toLowerCase().contains(website));
    }

    @Test
    void testFindByCriteriaWithOfferType() {
        OfferType type = OfferType.TRAINING;
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .offerType(type)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getOffer().getType() == type);
    }

    @Test
    void testFindByCriteriaWithProviderName() {
        String provider = "(acsh)";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .providerNameLike(provider)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getProvider().getName().toLowerCase().contains(provider));
    }

    @Test
    void testFindByCriteriaWithOfferName() {
        String offer = "cloud";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .offerNameLike(offer)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getOffer().getName().toLowerCase().contains(offer));
    }

    @Test
    void testFindByCriteriaWithTopicName() {
        String topic = "cloud";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .topicNameLike(topic)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings)
                .isNotEmpty()
                .allSatisfy(listing -> {
                    // Assert that the offer's topics contain the topic name
                    boolean topicExists = listing.getOffer().getTopics()
                            .stream()
                            .anyMatch(t -> t.getName().toLowerCase().contains(topic));

                    Assertions.assertThat(topicExists)
                            .as("Offer topic names should contain: " + topic)
                            .isTrue();
                });
    }

    @Test
    void testFindByCriteriaWithOfferDescription() {
        String offerDescription = "bedrohungen";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .offerDescriptionLike(offerDescription)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings).isNotEmpty();
        Assertions.assertThat(listings).allMatch(listing -> listing.getOffer().getDescription().toLowerCase().contains(offerDescription));
    }

    @Test
    void testFindByCriteriaWithTopicDescription() {
        String topicDescription = "planung";
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .topicDescriptionLike(topicDescription)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings)
                .isNotEmpty()
                .allSatisfy(listing -> {
                    // Assert that the offer's topics contain the topic name
                    boolean topicExists = listing.getOffer().getTopics()
                            .stream()
                            .anyMatch(t -> t.getDescription().toLowerCase().contains(topicDescription));

                    Assertions.assertThat(topicExists)
                            .as("Offer topic descriptions should contain: " + topicDescription)
                            .isTrue();
                });
    }

    @Test
    void testFindByCriteriaWithTopicNames() {
        List<String> topicNames = List.of("cloud", "e-mail");
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .topicNamesLike(topicNames)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings)
                .isNotEmpty()
                .allSatisfy(listing -> {
                    // Assert that the offer's topics contain the topic name
                    boolean topicExists = listing.getOffer().getTopics()
                            .stream()
                            .anyMatch(topic -> topicNames.stream().anyMatch(name -> topic.getDescription().toLowerCase().contains(name)));

                    Assertions.assertThat(topicExists)
                            .as("Offer topic names should contain: " + topicNames)
                            .isTrue();
                });
    }

    @Test
    void testFindByCriteriaWithProviderNames() {
        List<String> providerNames = List.of("(acsh)", "(ash)");
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .providerNamesLike(providerNames)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings)
                .isNotEmpty()
                .allSatisfy(listing -> {
                    // Assert that provider name matches any of the given names
                    boolean providerExists = providerNames
                            .stream()
                            .anyMatch(name -> listing.getProvider().getName().toLowerCase().contains(name));

                    Assertions.assertThat(providerExists)
                            .as("Provider names should contain: " + providerNames)
                            .isTrue();
                });
    }

    @Test
    void testFindByCriteriaWithProviderNamesExact() {
        List<String> providerNames = List.of("Akademie für Cyber-Sicherheit im Handwerk (ACSH)", "Allianz für Sichere Handwerksbetriebe (ASH)");
        EducationSearchCriteria searchCriteria = EducationSearchCriteria.builder()
                .providerNames(providerNames)
                .build();
        List<Listing> listings = listingService.findByCriteria(searchCriteria);

        Assertions.assertThat(listings)
                .isNotEmpty()
                .allSatisfy(listing -> {
                    // Assert that provider name matches any of the given names
                    boolean providerExists = providerNames
                            .stream()
                            .anyMatch(name -> listing.getProvider().getName().contains(name));

                    Assertions.assertThat(providerExists)
                            .as("Provider names should exactly match: " + providerNames)
                            .isTrue();
                });
    }
}
