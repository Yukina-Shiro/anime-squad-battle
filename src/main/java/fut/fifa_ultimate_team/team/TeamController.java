package fut.fifa_ultimate_team.team;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/user/{userId}")
    public Team getMyTeam(@PathVariable Long userId) {
        return teamService.getTeamByUserId(userId);
    }

    @PutMapping("/{teamId}/swap")
    public Team swapCard(
            @PathVariable Long teamId,
            @RequestParam("userId") Long userId,
            @RequestParam("position") String position,
            @RequestParam("newCardId") Long newCardId) {

        return teamService.swapCard(teamId, userId, position, newCardId);
    }

    @PutMapping("/{teamId}/remove")
    public Team removeCard(
            @PathVariable Long teamId,
            @RequestParam("userId") Long userId,
            @RequestParam("position") String position) {

        return teamService.removeCard(teamId, userId, position);
    }
}