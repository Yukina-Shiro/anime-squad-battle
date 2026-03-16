package fut.fifa_ultimate_team.packs;

import fut.fifa_ultimate_team.cards.CardTemplate;
import fut.fifa_ultimate_team.cards.CardTemplateRepository;
import fut.fifa_ultimate_team.users.AppUser;
import fut.fifa_ultimate_team.users.AppUserRepository;
import fut.fifa_ultimate_team.usercards.UserCard;
import fut.fifa_ultimate_team.usercards.UserCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PackService {

    private final AppUserRepository userRepository;
    private final UserCardRepository userCardRepository;
    private final CardTemplateRepository cardTemplateRepository;

    public PackService(AppUserRepository userRepository, UserCardRepository userCardRepository, CardTemplateRepository cardTemplateRepository) {
        this.userRepository = userRepository;
        this.userCardRepository = userCardRepository;
        this.cardTemplateRepository = cardTemplateRepository;
    }

    @Transactional
    public List<UserCard> openPack(Long userId, PackType packType) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getCoins() < packType.getCost()) {
            throw new RuntimeException("Fonds insuffisants pour acheter ce pack !");
        }

        user.setCoins(user.getCoins() - packType.getCost());
        userRepository.save(user);

        List<UserCard> pulledCards = new ArrayList<>();

        // 5 cartes par pack
        for (int i = 0; i < 5; i++) {
            String rolledRarity = determineRarityWithWeights(packType);
            CardTemplate pulledTemplate = cardTemplateRepository.findRandomByRarity(rolledRarity);

            if (pulledTemplate == null) {
                throw new RuntimeException("Erreur critique : Aucune carte trouvée en base pour la rareté " + rolledRarity);
            }

            // Vérification des doublons (gestion de la Quantity)
            Optional<UserCard> existingCardOpt = userCardRepository.findByOwnerIdAndCardTemplateId(user.getId(), pulledTemplate.getId());

            UserCard savedCard;
            if (existingCardOpt.isPresent()) {
                UserCard existingCard = existingCardOpt.get();
                existingCard.setQuantity(existingCard.getQuantity() + 1);
                savedCard = userCardRepository.save(existingCard);
            } else {
                UserCard newCard = new UserCard();
                newCard.setOwner(user);
                newCard.setCardTemplate(pulledTemplate);
                newCard.setQuantity(1);
                savedCard = userCardRepository.save(newCard);
            }

            pulledCards.add(savedCard);
        }

        return pulledCards;
    }

    private String determineRarityWithWeights(PackType packType) {
        double roll = ThreadLocalRandom.current().nextDouble(100.0);
        double cumulativeProbability = 0.0;

        for (Map.Entry<String, Double> entry : packType.getProbabilities().entrySet()) {
            cumulativeProbability += entry.getValue();
            if (roll <= cumulativeProbability) {
                return entry.getKey();
            }
        }

        return "COMMON";
    }
}