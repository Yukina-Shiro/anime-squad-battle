package fut.fifa_ultimate_team.market;

import fut.fifa_ultimate_team.users.AppUser;
import fut.fifa_ultimate_team.usercards.UserCard;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "market_offer")
public class MarketOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private AppUser seller;

    @OneToOne // Une annonce concerne une seule carte physique précise
    @JoinColumn(name = "user_card_id", nullable = false)
    private UserCard userCard;

    @Column(nullable = false)
    private Integer price;

    public MarketOffer(AppUser seller, UserCard userCard, Integer price) {
        this.seller = seller;
        this.userCard = userCard;
        this.price = price;
    }


    
}