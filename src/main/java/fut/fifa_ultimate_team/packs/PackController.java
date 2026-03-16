package fut.fifa_ultimate_team.packs;

import fut.fifa_ultimate_team.usercards.UserCard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market/packs")
@CrossOrigin(origins = "*") // Pour autoriser le front-end
public class PackController {

    private final PackService packService;

    public PackController(PackService packService) {
        this.packService = packService;
    }

    // POST /api/market/packs/open?userId=1&packType=COMMON
    @PostMapping("/open")
    public ResponseEntity<?> openPack(@RequestParam Long userId, @RequestParam PackType packType) {
        try {
            List<UserCard> newCards = packService.openPack(userId, packType);
            return ResponseEntity.ok(newCards);
        } catch (RuntimeException e) {
            // Renvoie une erreur 400 avec le message du Service (ex: "Fonds insuffisants")
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}