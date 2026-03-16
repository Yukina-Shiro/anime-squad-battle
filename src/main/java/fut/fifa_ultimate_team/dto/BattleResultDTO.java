package fut.fifa_ultimate_team.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BattleResultDTO {
    private boolean victory;
    private int attackerScore;
    private int defenderScore;
    private int coinsEarned;
    private String message;
}