package fut.fifa_ultimate_team.battle;

import fut.fifa_ultimate_team.dto.BattleResultDTO;
import fut.fifa_ultimate_team.team.Team;
import fut.fifa_ultimate_team.team.TeamRepository;
import fut.fifa_ultimate_team.users.AppUser;
import fut.fifa_ultimate_team.users.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class BattleService {

    private final TeamRepository teamRepository;
    private final AppUserRepository userRepository;

    public BattleService(TeamRepository teamRepository, AppUserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BattleResultDTO fight(Long attackerUserId, Long defenderUserId) {
        // 1. Récupérer l'attaquant et son équipe
        AppUser attacker = userRepository.findById(attackerUserId)
                .orElseThrow(() -> new RuntimeException("Attaquant introuvable"));
        Team attackerTeam = teamRepository.findByOwnerId(attackerUserId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("L'attaquant n'a pas d'équipe"));

        // 2. Récupérer l'équipe défenseur VIA l'ID du joueur adverse (Nouveau !)
        Team defenderTeam = teamRepository.findByOwnerId(defenderUserId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("L'adversaire n'a pas d'équipe"));

        // 3. Calcul du score
        int attackerScore = calculateMatchScore(attackerTeam.getOverallRating());
        int defenderScore = calculateMatchScore(defenderTeam.getOverallRating());

        if (attackerScore == defenderScore) {
            attackerScore += 1; // Évite les égalités parfaites
        }

        boolean isVictory = attackerScore > defenderScore;
        int coinsEarned = 0;
        String message;

        // --- SÉCURITÉ STATS ---
        if (attacker.getMatchesPlayed() == null) attacker.setMatchesPlayed(0);
        if (attacker.getWins() == null) attacker.setWins(0);
        if (attacker.getLosses() == null) attacker.setLosses(0);

        // --- MISE À JOUR ---
        attacker.setMatchesPlayed(attacker.getMatchesPlayed() + 1);

        if (isVictory) {
            attacker.setWins(attacker.getWins() + 1);
            coinsEarned = 500;
            // Message personnalisé avec le nom de l'adversaire
            message = "Victoire ! Vous avez battu l'équipe de " + defenderTeam.getOwner().getUsername();
        } else {
            attacker.setLosses(attacker.getLosses() + 1);
            coinsEarned = 50;
            message = "Défaite... L'équipe de " + defenderTeam.getOwner().getUsername() + " était trop forte.";
        }

        attacker.setCoins(attacker.getCoins() + coinsEarned);
        userRepository.save(attacker);

        return new BattleResultDTO(isVictory, attackerScore, defenderScore, coinsEarned, message);
    }

    private int calculateMatchScore(int overallRating) {
        int baseScore = Math.max(overallRating, 10);
        double rng = ThreadLocalRandom.current().nextDouble(0.8, 1.2);
        return (int) (baseScore * rng);
    }
}