package fut.fifa_ultimate_team.users;

import fut.fifa_ultimate_team.cards.CardTemplate;
import fut.fifa_ultimate_team.cards.CardTemplateRepository;
import fut.fifa_ultimate_team.team.Team;
import fut.fifa_ultimate_team.team.TeamRepository;
import fut.fifa_ultimate_team.usercards.UserCard;
import fut.fifa_ultimate_team.usercards.UserCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    private final AppUserRepository userRepository;
    private final TeamRepository teamRepository;
    private final UserCardRepository userCardRepository;
    private final CardTemplateRepository cardTemplateRepository;

    public UserService(AppUserRepository userRepository, TeamRepository teamRepository, UserCardRepository userCardRepository, CardTemplateRepository cardTemplateRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.userCardRepository = userCardRepository;
        this.cardTemplateRepository = cardTemplateRepository;
    }

    @Transactional // Si une étape plante, tout s'annule
    public AppUser registerNewUser(String username, String password) {
        // Création du joueur (les 2000 coins sont gérés par la valeur par défaut de l'entité)
        AppUser newUser = new AppUser();
        newUser.setUsername(username);
        newUser.setPassword(password); 
        newUser = userRepository.save(newUser);

        // Générer 5 cartes de départ 
        List<CardTemplate> commons = cardTemplateRepository.findByRarity("Common");
        // On mélange la liste pour prendre 5 cartes au hasard
        Collections.shuffle(commons);

        List<UserCard> starterCards = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            UserCard card = new UserCard();
            card.setOwner(newUser);
            card.setCardTemplate(commons.get(i));
            starterCards.add(userCardRepository.save(card));
        }

        // 3. Assigner les positions dans l'équipe
        Team team = new Team();
        team.setOwner(newUser);
        team.setGoal(starterCards.get(0));
        team.setCaptain(starterCards.get(1));
        team.setLeftArm(starterCards.get(2));
        team.setRightArm(starterCards.get(3));
        team.setCenter(starterCards.get(4));
        teamRepository.save(team);

        return newUser;
    }
}