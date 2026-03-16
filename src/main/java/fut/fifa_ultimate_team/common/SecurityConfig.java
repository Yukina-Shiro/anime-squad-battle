package fut.fifa_ultimate_team.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // On déclare l'outil BCrypt pour pouvoir l'injecter dans nos Contrôleurs
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // On configure Spring Security pour laisser passer nos requêtes Front-End
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Désactivé car on n'utilise pas de formulaires HTML classiques
                .cors(Customizer.withDefaults()) // Permet à vos annotations @CrossOrigin de continuer à fonctionner
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // On autorise toutes les routes /api/

        return http.build();
    }
}