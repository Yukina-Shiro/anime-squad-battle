package fut.fifa_ultimate_team.cards;

import org.springframework.stereotype.Service;
import java.util.List;

@Service // Logique métier de la partie Cartes
public class CardService {

    // On déclare le Repository
    private final CardTemplateRepository cardRepository;

    // Injection de dépendance via le constructeur
    public CardService(CardTemplateRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    // 1. Récupérer toutes les cartes
    public List<CardTemplate> getAllCards() {
        return cardRepository.findAll();
    }

    // 2. Récupérer une carte spécifique par son ID
    public CardTemplate getCardById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Erreur : La carte avec l'ID " + id + " n'existe pas !"));
    }

    // 3. Récupérer les cartes selon leur rareté
    public List<CardTemplate> getCardsByRarity(String rarity) {
        return cardRepository.findByRarity(rarity);
    }
}