# Annuaire des Alumni 

> Application Full-Stack permettant aux anciens étudiants du département de Génie Informatique de l'ENSPM de créer leur profil et d'être retrouvés facilement par leurs pairs.


##  Table des matières

1. [Présentation du projet](#présentation-du-projet)
2. [Technologies utilisées](#technologies-utilisées)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Lancement du projet](#lancement-du-projet)
6. [Peuplement de la base de données (Seeding)](#peuplement-de-la-base-de-données-seeding)
7. [Structure des dossiers](#structure-des-dossiers)
8. [Routes API](#routes-api)
9. [Exemples de requêtes](#exemples-de-requêtes)
10. [Fonctionnalités Front-End](#fonctionnalités-front-end)
11. [Variables d'environnement](#variables-denvironnement)
12. [Équipe](#équipe)

## Présentation du projet

L'**Annuaire des Alumni** est un répertoire numérique filtrable destiné aux anciens diplômés de l'ENSPM. Il permet de :

- **Créer un profil** avec ses informations professionnelles (entreprise, poste, compétences)
- **Explorer** tous les profils sous forme de cartes visuelles
- **Rechercher** un ancien par son nom
- **Filtrer** par année de promotion

> ⚠️ Le système de messagerie interne est exclu du MVP. Le contact se fait via les liens LinkedIn ou adresses email affichés sur les profils.


## Technologies utilisées

| Côté            | Technologie 
| Back-End        | Node.js, Express.js 
| Base de données | MongoDB, Mongoose 
| Front-End       | React.js (Vite) 
| Requêtes HTTP   | Axios 
| Style           | CSS Modules / Tailwind CSS 

## Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v9 ou supérieur
- [MongoDB](https://www.mongodb.com/) (local ou compte MongoDB Atlas)
- [Git](https://git-scm.com/)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-groupe/annuaire-alumni.git
cd annuaire-alumni
```

### 2. Installer les dépendances du Back-End

```bash
cd backend
npm install
```

### 3. Installer les dépendances du Front-End

```bash
cd ../frontend
npm install
```

### 4. Configurer les variables d'environnement

Dans le dossier `backend/`, créez un fichier `.env` en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Puis remplissez les valeurs dans `.env` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/alumni_db
```

> Si vous utilisez MongoDB Atlas, remplacez `MONGO_URI` par votre chaîne de connexion Atlas.

## Lancement du projet

### Lancer le Back-End

```bash
cd backend
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

### Lancer le Front-End

```bash
cd frontend
npm run dev
```

L'application React est accessible sur **http://localhost:5173**

## Peuplement de la base de données (Seeding)

Pour peupler la base avec **15 profils fictifs** d'alumni (nécessaire pour tester les filtres) :

```bash
cd backend
node seed.js
```

Message attendu en console :

```
✅ Base de données peuplée avec 15 profils Alumni.
```

> ⚠️ Le script efface les données existantes avant d'insérer les profils de test. Ne pas exécuter en production.

## Structure des dossiers

```
annuaire-alumni/
│
├── backend/
│   ├── models/
│   │   └── alumni.js          # Modèle Mongoose Alumni
│   ├── routes/
│   │   └── alumni.js          # Routes API RESTful
│   ├── middleware/
│   │   └── errorHandler.js    # Gestion centralisée des erreurs
│   ├── seed.js                # Script de peuplement (15 profils fictifs)
│   ├── server.js              # Point d'entrée du serveur Express
│   ├── .env                   # Variables d'environnement (non versionné)
│   └── .env.example           # Modèle de variables d'environnement
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Barre de navigation + bouton inscription
│   │   │   ├── SearchFilters.jsx  # Barre de recherche + menu déroulant
│   │   │   ├── DirectoryGrid.jsx  # Grille d'affichage des cartes
│   │   │   ├── AlumniCard.jsx     # Carte individuelle d'un alumni
│   │   │   ├── RegisterForm.jsx   # Formulaire d'inscription
│   │   │   └── Spinner.jsx        # Indicateur de chargement
│   │   ├── hooks/
│   │   │   └── useDebounce.js     # Hook personnalisé anti-spam (500ms)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Routes API

### Base URL : `http://localhost:5000/api`

### `POST /api/alumni`

Crée un nouveau profil Alumni.

**Corps de la requête (JSON) :**

```json
{
  "fullName": " jean Yves ",
  "graduationYear": 2021,
  "company": "Orange Cameroun",
  "jobTitle": "Développeur Full-Stack",
  "skills": ["React", "Node.js", "MongoDB"],
  "contactEmail": "Enspm@example.com"
}
```

**Réponses :**

| Code                        | Description |
| `201 Created`               | Profil créé avec succès |
| `400 Bad Request`           | Champ manquant ou invalide |
| `500 Internal Server Error` | Erreur serveur |


### `GET /api/alumni`

Récupère la liste des profils. Supporte les filtres via **query strings**.

**Paramètres optionnels :**

| Paramètre | Type   | Description                               | Exemple |
| `search`  | String | Recherche par nom (insensible à la casse) | `?search=Yves` |
| `promo`   | Number | Filtre par année de promotion             | `?promo=2021` |

**Réponses :**

| Code                        | Description |
| `200 OK`                    | Liste des profils (tableau JSON) |
| `500 Internal Server Error` | Erreur serveur |


## Exemples de requêtes

### Récupérer tous les profils

```
GET http://localhost:5000/api/alumni
```

### Rechercher par nom

```
GET http://localhost:5000/api/alumni?search=Yves
```

### Filtrer par année de promotion

```
GET http://localhost:5000/api/alumni?promo=2024
```

### Recherche combinée (nom + année)

```
GET http://localhost:5000/api/alumni?search=jean&promo=2024
```

### Exemple de réponse `200 OK`

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "  Jean Yves ",
    "graduationYear": 2021,
    "company": "Orange Cameroun",
    "jobTitle": "Développeur Full-Stack",
    "skills": ["React", "Node.js", "MongoDB"],
    "contactEmail": "Enspm@example.com",
    "__v": 0
  }
]
```

## Fonctionnalités Front-End

### 🔍 Recherche avec Debounce

La barre de recherche utilise un **hook personnalisé `useDebounce`** avec un délai de **500ms**. Cela signifie que la requête vers l'API n'est envoyée que lorsque l'utilisateur **arrête de taper pendant 500ms**, évitant ainsi les appels réseau excessifs.

```js
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

### ⏳ Indicateur de chargement

Le **Spinner** s'affiche uniquement dans la **grille de résultats**, sans bloquer l'écran complet, pour une meilleure expérience utilisateur.

### 📝 Formulaire d'inscription

Le formulaire `<RegisterForm />` permet d'ajouter un profil directement depuis l'interface. Il inclut :
- Validation côté front (champs requis, format email, max 3 compétences)
- Message de succès après soumission
- Message d'erreur en cas d'échec

## Variables d'environnement

Fichier `.env.example` à dupliquer en `.env` :

```env
# Port du serveur Express
PORT=5000

# URI de connexion MongoDB
# Locale :
MONGO_URI=mongodb://localhost:27017/alumni_db
# Atlas :
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/alumni_db
```

## Équipe
###  Membre 1 — Chef de projet & Configuration (Steve_Jorel)

- Création du dépôt Git et invitation de tous les membres de l'équipe
- Installation et configuration du projet Node.js + Express (structure des dossiers, `server.js`, `package.json`)
- Connexion à la base de données MongoDB via Mongoose et validation du fonctionnement
- Création du fichier `seed.js` avec 15 profils fictifs d'Alumni pour les tests
- Tests de toutes les routes API avec Postman (POST, GET sans filtre, GET par nom, GET par année, GET combiné)
- Rédaction du `README.md`
- Organisation des réunions quotidiennes de suivi (15 min/jour)


###  Membre 2 — Développeur Back-End (Avanga)

- Création du modèle Mongoose `Alumni` avec tous les champs requis (`fullName`, `graduationYear`, `company`, `jobTitle`, `skills`, `contactEmail`) et leurs contraintes (requis, index, maximum 3 compétences)
- Développement de la route `POST /api/alumni` avec validation des données et gestion des erreurs (400, 500)
- Développement de la route `GET /api/alumni` avec lecture de `req.query`
- Implémentation des filtres via expressions régulières Mongoose insensibles à la casse (`$regex`, `$options: 'i'`)
- Gestion de la combinaison des deux filtres simultanés (`search` + `promo`)


###  Membre 3 — Développeur Front-End (Logique & Recherche) (Laminou)

- Initialisation du projet React avec Vite et organisation des dossiers de composants
- Création du composant `<Header />` avec le bouton "Rejoindre l'annuaire"
- Création du composant `<SearchFilters />` : barre de recherche textuelle et menu déroulant des années de promotion
- Implémentation du hook personnalisé `useDebounce` (délai 500ms) pour éviter les requêtes en rafale lors de la frappe
- Gestion de l'état global des filtres (`searchTerm`, `promoFilter`) et déclenchement du fetch via `useEffect` sur les valeurs débouncées
- Mise en place des appels Axios vers l'API back-end


###  Membre 4 — Développeur Front-End (UI & Design) (Aminou) 

- Création du composant `<AlumniCard />` : avatar par défaut, nom, poste, entreprise, badges de compétences, liens LinkedIn/email
- Création du composant `<DirectoryGrid />` affichant dynamiquement toutes les cartes
- Intégration du composant `<Spinner />` visible uniquement dans la grille de résultats (pas en plein écran)
- Affichage d'un message "Aucun résultat trouvé" si la recherche ne retourne rien
- Mise en page responsive (adaptation mobile et desktop) et soignée du design général


###  Membre 5 — Formulaire d'inscription & Présentation (Mouctar)

- Création du composant `<RegisterForm />` avec tous les champs du profil (nom, année, entreprise, poste, compétences, email)
- Gestion dynamique des compétences : ajout et suppression de badges (maximum 3)
- Envoi des données du formulaire à la route `POST /api/alumni` et affichage d'un message de succès
- Validation côté front-end : messages d'erreur clairs si un champ est manquant ou mal rempli
- Préparation et animation de la démonstration finale lors de la soutenance