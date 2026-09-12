# Planificateur de voyage

Webapp Google Apps Script pour préparer un voyage à plusieurs : étapes (transport,
location, hébergement, activité, repas...), carte Google Maps intégrée, voyageurs
et répartition automatique du budget par personne.

## Stack

- **Frontend + backend** : Google Apps Script (HtmlService), servi comme Web App.
- **Données** : Google Sheet (feuilles "Etapes" et "Voyageurs"), pas de base de
  données externe.
- **Carte** : Google Maps Embed API (clé à renseigner dans `Code.gs`).

Ce dépôt sert de sauvegarde versionnée du code. Le déploiement réel se fait en
collant ces fichiers dans l'éditeur Apps Script lié au Google Sheet (voir plus bas) —
GitHub n'héberge pas l'exécution, seulement le code source.

## Fichiers

| Fichier | Rôle |
|---|---|
| `Code.gs` | Backend : lecture/écriture du Google Sheet, routes `doGet`, clé Maps |
| `Index.html` | Structure HTML, formulaire de saisie, 4 onglets |
| `Stylesheet.html` | Styles (palette rouge/jaune) |
| `JavaScript.html` | Logique client : onglets, pastilles, carte, budget |

## Déploiement

1. Créer ou ouvrir un Google Sheet dédié.
2. Extensions → Apps Script.
3. Coller le contenu des 4 fichiers ci-dessus (noms de fichiers identiques, sans
   l'extension `.html` dans l'éditeur Apps Script pour les fichiers HTML).
4. Dans `Code.gs`, vérifier `SPREADSHEET_ID` (l'ID du Sheet visé) et remplacer
   `MAPS_API_KEY` par une clé "Maps Embed API" valide.
5. Déployer → Nouveau déploiement → Application Web → exécuter en tant que "Moi",
   accès selon besoin.

## ⚠️ Sécurité

`MAPS_API_KEY` est en clair dans `Code.gs`. Si ce dépôt est public, restreins la
clé (API + referrers) dans Google Cloud Console, ou passe-la plutôt par
`PropertiesService` et garde ce repo public sans clé réelle committée.

## Historique

Développé par itérations successives : saisie/tri des étapes, édition, carte
Maps intégrée, types Transport/Location avec sous-modes, gestion des chambres
multiples pour un hébergement, voyageurs et budget partagé.
