package fut.fifa_ultimate_team.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String username;
    private Integer coins;
    private Integer wins;
    private Integer losses;
    private Integer matchesPlayed;
}