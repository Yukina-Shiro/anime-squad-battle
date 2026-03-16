package fut.fifa_ultimate_team.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fut.fifa_ultimate_team.cards.CardTemplate;
import fut.fifa_ultimate_team.cards.CardTemplateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class CardDataLoader implements CommandLineRunner {

    private final CardTemplateRepository repository;
    private final ObjectMapper objectMapper; // Outil de Jackson pour lire le JSON

    public CardDataLoader(CardTemplateRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. On vérifie si la base contient déjà des données
        if (repository.count() == 0) {
            System.out.println("🚀 Base de données vide. Chargement des cartes Anime...");

            try {
                // 2. On lit le fichier depuis le dossier resources
                InputStream inputStream = TypeReference.class.getResourceAsStream("/final_anime_cards.json");

                if (inputStream == null) {
                    System.out.println("❌ ERREUR : Le fichier final_anime_cards.json est introuvable !");
                    return;
                }

                // 3. On convertit le JSON en une Liste de CardTemplate
                List<CardTemplate> cards = objectMapper.readValue(inputStream, new TypeReference<List<CardTemplate>>(){});

                // 4. On sauvegarde tout en base
                repository.saveAll(cards);

                System.out.println("✅ SUCCÈS : " + cards.size() + " cartes ont été importées dans la base de données !");

            } catch (IOException e) {
                System.out.println("❌ ERREUR lors de l'importation : " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("👌 La base de données contient déjà des cartes. Importation ignorée.");
        }
    }
}