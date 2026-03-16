package fut.fifa_ultimate_team.usercards;

import fut.fifa_ultimate_team.cards.CardTemplate;
import fut.fifa_ultimate_team.users.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "user_card", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "card_template_id"})
})
public class UserCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private AppUser owner;

    @ManyToOne
    @JoinColumn(name = "card_template_id", nullable = false)
    private CardTemplate cardTemplate;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "obtained_at", nullable = false, updatable = false)
    private LocalDateTime obtainedAt = LocalDateTime.now();

    @Column(name = "on_market", nullable = false)
    private boolean onMarket = false;

    @Column(name = "is_in_team", nullable = false)
    private boolean isInTeam = false;
}