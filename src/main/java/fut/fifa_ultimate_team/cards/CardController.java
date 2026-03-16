package fut.fifa_ultimate_team.cards;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cards") // Toutes les URL de ce fichier commenceront par /api/cards
@CrossOrigin(origins = "*") // Autorise le Front-End à interroger cette API
public class CardController {

    // Le Contrôleur passe par le Service
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    // Route 1 : GET http://localhost:8080/api/cards
    @GetMapping
    public List<CardTemplate> getAllCards() {
        return cardService.getAllCards();
    }

    // Route 2 : GET http://localhost:8080/api/cards/5
    // @PathVariable dit à Spring d'extraire le "5" de l'URL et de le mettre dans la variable "id"
    @GetMapping("/{id}")
    public CardTemplate getCardById(@PathVariable Long id) {
        return cardService.getCardById(id);
    }

    // Route 3 : GET http://localhost:8080/api/cards/rarity/Legendary
    @GetMapping("/rarity/{rarity}")
    public List<CardTemplate> getCardsByRarity(@PathVariable String rarity) {
        return cardService.getCardsByRarity(rarity);
    }
}