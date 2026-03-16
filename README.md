# 🎌 Anime Squad Battle (FUT Anime)

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Résumé du projet

**Anime Squad Battle** est une application web interactive de type "Gacha" (collection de cartes) combinée à un jeu de gestion d'équipe stratégique, fortement inspirée du mode *Ultimate Team* de la franchise FIFA, mais transposée dans l'univers des animes (Naruto, Dragon Ball, One Piece, Jujutsu Kaisen, etc.).

Le joueur commence avec un pécule de départ, invoque des personnages en ouvrant des packs, compose la meilleure formation possible sur le terrain en respectant les rôles, et affronte d'autres joueurs pour gagner des pièces (`Coins`) et améliorer son équipe.

Ce projet a été réalisé dans le cadre d'un projet universitaire Fullstack, mettant en avant une séparation stricte entre une API REST robuste et une architecture Frontend (SPA) moderne en Vanilla JS.

---

## ✨ Fonctionnalités

* 🎴 **Collection et Inventaire :** Affichage dynamique des cartes possédées avec une modale 3D interactive pour voir les statistiques détaillées. Filtrage en temps réel par Rareté et par Rôle.
* 🎰 **Boutique de Packs (Gacha) :** Système d'invocation avec vérification sécurisée des fonds côté serveur. Animations interactives d'ouverture de packs et algorithme de probabilités (taux de drop selon le type de pack).
* ⚽ **Gestion de l'Équipe (Terrain) :** Interface en Drag & Drop (Glisser-Déposer) pour placer ses joueurs sur le terrain. Validation stricte des rôles (ex: un Gardien ne peut pas jouer en Attaque) et calcul en temps réel de la puissance globale (OVR).
* ⚔️ **Arène de Combat (Battle) :** Matchmaking permettant d'affronter les équipes des autres joueurs inscrits. Simulation de combat basée sur les statistiques des cartes et récompenses monétaires (Coins) dynamiques.
* 🛒 **Marché des Transferts :** Véritable économie entre joueurs. Possibilité de mettre en vente ses doublons et d'acheter des cartes mises en ligne par la communauté via un système de transactions sécurisées.

---

## 🏗️ Architecture du code

Le projet est divisé en deux parties distinctes communiquant via des requêtes HTTP (API REST).

### ⚙️ Backend (Java / Spring Boot 3)
Le moteur de l'application, gérant la logique métier, la persistance et la sécurité.
* **Base de données :** PostgreSQL hébergée dans le cloud.
* **ORM :** Spring Data JPA / Hibernate.
* **Couches architecturales :** * `Controllers` : Expose les Endpoints REST.
  * `Services` : Contient la logique métier et la sécurité (`@Transactional` pour les achats).
  * `Repositories` : Gère les requêtes vers la base de données.
  * `DTO` (Data Transfer Objects) : Sécurise et formate les données renvoyées au client.

### 🎨 Frontend (Vanilla JS / Tailwind CSS)
Une *Single Page Application* (SPA) légère et réactive, sans framework lourd (pas de React/Vue).
* **Routage :** Système de navigation interne centralisé (`app.js`) ne rechargeant que le contenu nécessaire.
* **Style :** Tailwind CSS pour un design "Cyberpunk/Néon" entièrement responsive.
* **Communication API :** Intercepteur personnalisé (`apiClient.js`) centralisant les requêtes `fetch` et la gestion des erreurs JSON renvoyées par le backend.
* **Composants :** Modules ES6 isolés (gestion de la collection, du drag & drop, etc.).

---

## 🚀 Tutoriel pour lancer le projet

### Prérequis
* **Java 17** (ou supérieur)
* **PostgreSQL** (ou accès à une base de données cloud comme Neon.tech)
* Une extension comme **Live Server** sur VS Code (pour exécuter le Frontend)

### 1. Configuration de la base de données (Backend)
Par défaut, le projet est configuré pour se connecter à une base de données cloud via `application.yaml`. Si vous souhaitez le faire tourner en local :
1. Créez une base de données PostgreSQL nommée `anime_fut`.
2. Ouvrez le fichier `src/main/resources/application.yaml`.
3. Modifiez les identifiants de connexion :
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/anime_fut
    username: VOTRE_UTILISATEUR
    password: VOTRE_MOT_DE_PASSE
```

Note : Le fichier final_anime_cards.json et le CardDataLoader peupleront automatiquement la base de données avec les cartes au premier démarrage.

### 2. Lancement du Backend
Ouvrez un terminal à la racine du projet (là où se trouve le fichier pom.xml) et exécutez la commande suivante :

```Bash
# Sur Windows
./mvnw.cmd spring-boot:run

# Sur Mac/Linux
./mvnw spring-boot:run
```

L'API REST sera alors accessible sur http://localhost:8080.

### 3. Lancement du Frontend

1. Ouvrez le dossier frontend dans votre éditeur de code (ex: VS Code).

2. Lancez le fichier index.html à l'aide d'un serveur local (Exemple : clic droit -> Open with Live Server).

3. Connectez-vous, ouvrez vos premiers packs et bâtissez l'équipe ultime !
