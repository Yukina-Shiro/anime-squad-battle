package fut.fifa_ultimate_team.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    // Permet de trouver un joueur par son pseudo pour le login
    AppUser findByUsername(String username);
    List<AppUser> findTop10ByOrderByWinsDesc();
}