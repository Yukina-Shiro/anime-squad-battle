package fut.fifa_ultimate_team.users;

import fut.fifa_ultimate_team.dto.UserResponseDTO;
import fut.fifa_ultimate_team.team.Team;
import fut.fifa_ultimate_team.team.TeamRepository;
import fut.fifa_ultimate_team.usercards.UserCard;
import fut.fifa_ultimate_team.usercards.UserCardRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final AppUserRepository userRepository;
    private final TeamRepository teamRepository;
    private final UserCardRepository userCardRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(AppUserRepository userRepository, TeamRepository teamRepository, UserCardRepository userCardRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.userCardRepository = userCardRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody AppUser user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Ce pseudo est déjà pris !");
        }

        // Hacher le mot de passe avant la sauvegarde
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        user.setCoins(2000);
        AppUser savedUser = userRepository.save(user);

        Team defaultTeam = new Team("Équipe de " + user.getUsername(), savedUser);
        teamRepository.save(defaultTeam);

        return convertToDTO(savedUser);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody AppUser loginRequest) {
        AppUser user = userRepository.findByUsername(loginRequest.getUsername());

        // Comparer le mot de passe en clair avec le hash en BDD
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return convertToDTO(user);
        }

        throw new RuntimeException("Mauvais pseudo ou mot de passe");
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        List<AppUser> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{userId}/cards")
    public List<UserCard> getUserInventory(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur introuvable");
        }
        return userCardRepository.findByOwnerId(userId);
    }

    private UserResponseDTO convertToDTO(AppUser user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getCoins(),
                user.getWins() != null ? user.getWins() : 0,
                user.getLosses() != null ? user.getLosses() : 0,
                user.getMatchesPlayed() != null ? user.getMatchesPlayed() : 0
        );
    }

    @GetMapping("/{userId}/team")
    public Team getUserTeam(@PathVariable Long userId) {
        return teamRepository.findByOwnerId(userId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Aucune équipe trouvée pour cet utilisateur"));
    }

    // Récupérer les nouvelles stats d'un joueur
    @GetMapping("/{userId}")
    public UserResponseDTO getUser(@PathVariable Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return convertToDTO(user);
    }

    // Récupérer le classement des 10 meilleurs joueurs
    @GetMapping("/leaderboard")
    public List<UserResponseDTO> getLeaderboard() {
        return userRepository.findTop10ByOrderByWinsDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}