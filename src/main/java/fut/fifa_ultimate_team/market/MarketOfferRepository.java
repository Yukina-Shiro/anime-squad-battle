package fut.fifa_ultimate_team.market;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketOfferRepository extends JpaRepository<MarketOffer, Long> {
    // Utile si on veut afficher toutes les offres sauf celles du joueur lui-même
    // List<MarketOffer> findBySellerIdNot(Long sellerId);
}