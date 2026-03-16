package fut.fifa_ultimate_team.team;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fut.fifa_ultimate_team.users.AppUser;
import fut.fifa_ultimate_team.usercards.UserCard;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating = 0;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private AppUser owner;

    // Les 5 positions avec des noms de colonnes explicites
    @OneToOne
    @JoinColumn(name = "goal_id")
    private UserCard goal;

    @OneToOne
    @JoinColumn(name = "captain_id")
    private UserCard captain;

    @OneToOne
    @JoinColumn(name = "left_arm_id")
    private UserCard leftArm;

    @OneToOne
    @JoinColumn(name = "right_arm_id")
    private UserCard rightArm;

    @OneToOne
    @JoinColumn(name = "center_id")
    private UserCard center;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Team(String name, AppUser owner) {
        this.name = name;
        this.owner = owner;
    }
}