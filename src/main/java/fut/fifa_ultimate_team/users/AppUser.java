package fut.fifa_ultimate_team.users;

import fut.fifa_ultimate_team.team.Team;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "app_user") // IMPORTANT : pour éviter le conflit avec PostgreSQL
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private Integer coins;

    private Integer wins = 0;

    private Integer losses = 0;

    private Integer matchesPlayed = 0;

    // Un utilisateur peut avoir plusieurs équipes
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Team> teams = new ArrayList<>();

    // Constructeur pour créer un joueur facilement
    public AppUser(String username, String password) {
        this.username = username;
        this.password = password;
        this.coins = 2000; // Bonus de départ : 2000 pièces
    }
}