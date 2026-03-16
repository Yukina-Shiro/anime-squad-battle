package fut.fifa_ultimate_team.market;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping
    public List<MarketOffer> getAllOffers() {
        return marketService.getAllOffers();
    }

    @PostMapping("/sell")
    public MarketOffer sellCard(
            @RequestParam Long userId,
            @RequestParam Long userCardId,
            @RequestParam Integer price) {

        return marketService.sellCard(userId, userCardId, price);
    }

    @PostMapping("/buy/{offerId}")
    public void buyCard(
            @PathVariable Long offerId,
            @RequestParam Long buyerId) {

        marketService.buyCard(buyerId, offerId);
    }

    @DeleteMapping("/cancel/{offerId}")
    public void cancelOffer(
            @PathVariable("offerId") Long offerId,
            @RequestParam("sellerId") Long sellerId) {

        marketService.cancelOffer(sellerId, offerId);
    }
}