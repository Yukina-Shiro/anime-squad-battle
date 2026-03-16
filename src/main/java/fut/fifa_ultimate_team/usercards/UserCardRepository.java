package fut.fifa_ultimate_team.usercards;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {

    // Pour afficher l'inventaire complet d'un joueur
    List<UserCard> findByOwnerId(Long ownerId);

    // Pour vérifier si le joueur possède déjà ce personnage précis
    Optional<UserCard> findByOwnerIdAndCardTemplateId(Long ownerId, Long cardTemplateId);
}