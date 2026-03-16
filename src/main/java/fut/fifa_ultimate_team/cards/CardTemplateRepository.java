package fut.fifa_ultimate_team.cards;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardTemplateRepository extends JpaRepository<CardTemplate, Long> {
    // On pourra ajouter des méthodes custom plus tard
    List<CardTemplate> findByRarity(String rarity);

    @Query(value = "SELECT * FROM card_template WHERE rarity = :rarity ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    CardTemplate findRandomByRarity(@Param("rarity") String rarity);
}