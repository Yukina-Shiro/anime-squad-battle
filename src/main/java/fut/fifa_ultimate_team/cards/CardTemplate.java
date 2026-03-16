package fut.fifa_ultimate_team.cards;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data // Génère automatiquement les Getters et Setters
@NoArgsConstructor // Génère un constructeur vide obligatoire pour JPA
@Table(name = "card_template")
public class CardTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // L'ID technique de la base de données

    @JsonProperty("id_externe")
    private Long externalId; // L'ID venant de l'API AniList

    private String name;

    private String anime;

    // Stocke la liste des genres directement dans une table liée
    @ElementCollection
    private List<String> genres;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("bg_image")
    private String bgImage;

    @JsonProperty("frame_image")
    private String frameImage;

    private String rarity;

    private String role;

    @JsonProperty("overall")
    private Integer overallRating;

    // Les 6 Statistiques
    private Integer vitesse;
    private Integer force;
    private Integer dribble;
    private Integer defense;
    private Integer tir;
    private Integer passe;
}