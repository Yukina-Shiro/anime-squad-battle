package fut.fifa_ultimate_team.battle;

import fut.fifa_ultimate_team.dto.BattleResultDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/battles")
@CrossOrigin(origins = "*")
public class BattleController {

    private final BattleService battleService;

    public BattleController(BattleService battleService) {
        this.battleService = battleService;
    }

    @PostMapping("/fight")
    public BattleResultDTO fight(
            @RequestParam("attackerUserId") Long attackerUserId,
            @RequestParam("defenderUserId") Long defenderUserId) { // <-- Changement ici !
        return battleService.fight(attackerUserId, defenderUserId);
    }
}