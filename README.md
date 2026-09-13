# Planificateur de voyage

Webapp pour préparer un voyage à plusieurs : étapes (transport, location,
hébergement, activité, repas...), carte Google Maps intégrée, voyageurs et
répartition automatique du budget par personne.

## Stack

- **Frontend** : HTML/CSS/JS natif, hébergé sur **GitHub Pages** (site statique,
  aucune étape de build).
- **Backend / données** : **Supabase** (Postgres), projet partagé avec Moneta
  (`oxdjcwudprrhjsteznxl`), tables préfixées `voyage_*` pour rester isolées.
- **Carte** : Google Maps Embed API (clé dans `config.js`).

Le site est servi directement depuis ce dépôt : chaque modification poussée sur
`main` est visible sur GitHub Pages après quelques dizaines de secondes, sans
copier-coller manuel.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure HTML, formulaire de saisie, 4 onglets |
| `style.css` | Styles (palette rouge/jaune) |
| `config.js` | URL + clé publique Supabase, clé Maps Embed |
| `app.js` | Logique client : chargement/sauvegarde Supabase, onglets, carte, budget |
| `apps-script-legacy/` | Ancienne version Google Apps Script + Sheets, conservée pour référence |

## Authentification

- Connexion par **lien magique** (email, sans mot de passe) via Supabase Auth.
- Table `voyage_utilisateurs` (email, is_admin) : liste blanche des comptes autorisés
  à modifier des données. Se connecter via Supabase Auth ne suffit pas — il faut
  aussi être dans cette table (vérifié côté RLS par `voyage_is_authorized()` /
  `voyage_is_admin()`, pas seulement côté interface).
- Lecture (consultation du voyage) publique et sans connexion. Écriture (ajout,
  modification, suppression) réservée aux comptes autorisés.
- Onglet "Admin" (gestion des comptes autorisés) visible uniquement si
  `voyage_utilisateurs.is_admin = true` pour l'email connecté.
- ⚠️ Config requise dans le dashboard Supabase : Authentication → URL
  Configuration → ajouter `https://oguyot-ataug.github.io/planificateur-voyage/`
  dans "Redirect URLs", sinon le lien magique ne redirige pas correctement.

## Schéma Supabase (`voyage_*`)

- `voyage_voyageurs` — les personnes du voyage (`id`, `nom`)
- `voyage_etapes` — une ligne par étape (transport, hébergement, activité...)
- `voyage_etape_voyageurs` — table de jointure : qui est concerné par une étape
  (hors hébergement)
- `voyage_chambres` — une ligne par chambre, rattachée à une étape hébergement
- `voyage_chambre_voyageurs` — table de jointure : qui occupe quelle chambre

Toutes les tables ont RLS activé avec une policy publique (`using (true)`) —
adapté à un usage familial privé sans authentification, pas à un usage grand
public.

## Déploiement

1. GitHub Pages est activé sur ce dépôt (Settings → Pages → branche `main`,
   dossier `/`).
2. Le dépôt doit rester **public** : GitHub Pages sur compte gratuit ne
   fonctionne pas avec un dépôt privé (il faudrait GitHub Pro).
3. La clé Supabase dans `config.js` est une clé **publique** ("publishable"),
   faite pour être visible côté client — la sécurité repose sur les policies
   RLS, pas sur le secret du fichier.

## ⚠️ Sécurité

`MAPS_API_KEY` dans `config.js` doit être restreinte (API "Maps Embed API" +
referrers autorisés) dans Google Cloud Console, puisqu'elle est visible dans
le code source public.

## Historique

- Développé initialement en Google Apps Script + Google Sheets (voir
  `apps-script-legacy/`) : saisie/tri des étapes, édition, carte Maps intégrée,
  types Transport/Location avec sous-modes, chambres multiples, voyageurs et
  budget partagé.
- Migré vers GitHub Pages + Supabase pour permettre des modifications rapides
  du code sans copier-coller manuel dans l'éditeur Apps Script.

<!-- trigger pages build -->
<!-- rebuild trigger 1789249758 -->
<!-- rebuild trigger 1789281186 -->
