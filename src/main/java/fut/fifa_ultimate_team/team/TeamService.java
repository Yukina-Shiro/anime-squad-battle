package fut.fifa_ultimate_team.team;

import fut.fifa_ultimate_team.usercards.UserCard;
import fut.fifa_ultimate_team.usercards.UserCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserCardRepository userCardRepository;

    public TeamService(TeamRepository teamRepository, UserCardRepository userCardRepository) {
        this.teamRepository = teamRepository;
        this.userCardRepository = userCardRepository;
    }

    @Transactional
    public Team swapCard(Long teamId, Long userId, String position, Long newCardId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));

        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Cette équipe ne vous appartient pas");
        }

        UserCard newCard = userCardRepository.findById(newCardId)
                .orElseThrow(() -> new RuntimeException("Nouvelle carte introuvable"));

        if (!newCard.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Cette carte ne vous appartient pas");
        }

        // Vérifie si ce modèle de carte est déjà dans l'équipe
        if (isCharacterAlreadyInTeam(team, newCard.getCardTemplate().getId())) {
            throw new RuntimeException("Ce personnage est déjà présent dans votre équipe");
        }

        // L'échange dynamique
        switch (position.toLowerCase()) {
            case "goal":
                team.setGoal(newCard);
                break;
            case "captain":
                team.setCaptain(newCard);
                break;
            case "leftarm":
                team.setLeftArm(newCard);
                break;
            case "rightarm":
                team.setRightArm(newCard);
                break;
            case "center":
                team.setCenter(newCard);
                break;
            default:
                throw new IllegalArgumentException("Position invalide. Utilisez : goal, captain, leftarm, rightarm, center");
        }

        // On recalcule la puissance de l'équipe après le changement
        calculateTeamOverall(team);

        return teamRepository.save(team);
    }

    // --- Méthodes privées utilitaires ---

    @Transactional
    public Team removeCard(Long teamId, Long userId, String position) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));

        if (!team.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Cette équipe ne vous appartient pas");
        }

        // On retire la carte de la position demandée
        switch (position.toLowerCase()) {
            case "goal":
                team.setGoal(null);
                break;
            case "captain":
                team.setCaptain(null);
                break;
            case "leftarm":
                team.setLeftArm(null);
                break;
            case "rightarm":
                team.setRightArm(null);
                break;
            case "center":
                team.setCenter(null);
                break;
            default:
                throw new IllegalArgumentException("Position invalide.");
        }

        // On recalcule la moyenne de l'équipe
        calculateTeamOverall(team);

        return teamRepository.save(team);
    }

    private boolean isCharacterAlreadyInTeam(Team team, Long templateId) {
        return (team.getGoal() != null && team.getGoal().getCardTemplate().getId().equals(templateId)) ||
                (team.getCaptain() != null && team.getCaptain().getCardTemplate().getId().equals(templateId)) ||
                (team.getLeftArm() != null && team.getLeftArm().getCardTemplate().getId().equals(templateId)) ||
                (team.getRightArm() != null && team.getRightArm().getCardTemplate().getId().equals(templateId)) ||
                (team.getCenter() != null && team.getCenter().getCardTemplate().getId().equals(templateId));
    }

    private void calculateTeamOverall(Team team) {
        int total = 0;
        int count = 0;

        if (team.getGoal() != null) {
            total += team.getGoal().getCardTemplate().getOverallRating();
            count++;
        }
        if (team.getCaptain() != null) {
            total += team.getCaptain().getCardTemplate().getOverallRating();
            count++;
        }
        if (team.getLeftArm() != null) {
            total += team.getLeftArm().getCardTemplate().getOverallRating();
            count++;
        }
        if (team.getRightArm() != null) {
            total += team.getRightArm().getCardTemplate().getOverallRating();
            count++;
        }
        if (team.getCenter() != null) {
            total += team.getCenter().getCardTemplate().getOverallRating();
            count++;
        }

        //TODO : ajouter les affinité par genre 
        team.setOverallRating(count == 0 ? 0 : total / count);
    }

    public Team getTeamByUserId(Long userId) {
        return teamRepository.findByOwnerId(userId)
                .orElseThrow(() -> new RuntimeException("Aucune équipe trouvée pour ce joueur"));
    }
}