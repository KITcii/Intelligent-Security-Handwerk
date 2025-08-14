package ish.user.repository;

import ish.user.model.support.Listing;
import ish.user.model.support.OfferType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    // Search for listings by website (case insensitive)
    List<Listing> findByWebsiteContainingIgnoreCase(String website);

    // Search for listings associated with offers of a specific OfferType
    List<Listing> findByOfferType(OfferType offerType);
}