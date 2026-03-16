package fut.fifa_ultimate_team.market;

import fut.fifa_ultimate_team.users.AppUser;
import fut.fifa_ultimate_team.users.AppUserRepository;
import fut.fifa_ultimate_team.usercards.UserCard;
import fut.fifa_ultimate_team.usercards.UserCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MarketService {

    private final MarketOfferRepository marketOfferRepository;
    private final AppUserRepository userRepository;
    private final UserCardRepository userCardRepository;

    public MarketService(MarketOfferRepository marketOfferRepository, AppUserRepository userRepository, UserCardRepository userCardRepository) {
        this.marketOfferRepository = marketOfferRepository;
        this.userRepository = userRepository;
        this.userCardRepository = userCardRepository;
    }

    public List<MarketOffer> getAllOffers() {
        return marketOfferRepository.findAll();
    }

    @Transactional
    public MarketOffer sellCard(Long userId, Long userCardId, Integer price) {
        if (price <= 0) {
            throw new RuntimeException("Le prix doit être supérieur à zéro");
        }

        UserCard card = userCardRepository.findById(userCardId)
                .orElseThrow(() -> new RuntimeException("Carte introuvable"));

        if (!card.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Cette carte ne vous appartient pas");
        }

        // Vérification si la carte est déjà en vente
        if (card.isOnMarket()) {
            throw new RuntimeException("Cette carte est déjà en vente");
        }

        // On bloque la carte en la déclarant sur le marché
        card.setOnMarket(true);
        userCardRepository.save(card);

        // On crée l'annonce
        MarketOffer offer = new MarketOffer();
        offer.setSeller(card.getOwner());
        offer.setUserCard(card);
        offer.setPrice(price);

        return marketOfferRepository.save(offer);
    }

    @Transactional
    public void buyCard(Long buyerId, Long offerId) {
        MarketOffer offer = marketOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable ou déjà vendue"));

        AppUser buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Acheteur introuvable"));

        AppUser seller = offer.getSeller();

        if (buyer.getId().equals(seller.getId())) {
            throw new RuntimeException("Vous ne pouvez pas acheter votre propre carte");
        }

        if (buyer.getCoins() < offer.getPrice()) {
            throw new RuntimeException("Fonds insuffisants");
        }

        // 1. Mouvements d'argent
        buyer.setCoins(buyer.getCoins() - offer.getPrice());
        seller.setCoins(seller.getCoins() + offer.getPrice());

        userRepository.save(buyer);
        userRepository.save(seller);

        // 2. Transfert de propriété de la carte et déblocage
        UserCard card = offer.getUserCard();
        card.setOwner(buyer);
        card.setOnMarket(false); // La carte n'est plus sur le marché, le nouvel acheteur peut la jouer
        userCardRepository.save(card);

        // 3. Suppression de l'offre du marché
        marketOfferRepository.delete(offer);
    }

    @Transactional
    public void cancelOffer(Long sellerId, Long offerId) {
        MarketOffer offer = marketOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        if (!offer.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Vous ne pouvez pas annuler une vente qui ne vous appartient pas");
        }

        // On débloque la carte pour qu'elle puisse être rejouée
        UserCard card = offer.getUserCard();
        card.setOnMarket(false);
        userCardRepository.save(card);

        // On supprime l'offre du marché
        marketOfferRepository.delete(offer);
    }
}