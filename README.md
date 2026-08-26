# Pokedex

TD individuel Angular et communication vers une API.

**Auteur : Dillon Azag**

Application Angular qui liste les 151 Pokémon de la première génération à partir de
l'API publique [PokeAPI](https://pokeapi.co/), avec une recherche par nom qui filtre
la liste en direct pendant la saisie.

---

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancer l'application](#lancer-lapplication)
- [Autres commandes](#autres-commandes)
- [Structure du projet](#structure-du-projet)
- [Fonctionnement](#fonctionnement)
- [API utilisée](#api-utilisée)
- [Choix techniques](#choix-techniques)
- [Difficultés rencontrées](#difficultés-rencontrées)

---

## Prérequis

| Outil       | Version utilisée            |
| ----------- | --------------------------- |
| Node.js     | 24.16.0 (LTS ou supérieure) |
| npm         | 11.13.0                     |
| Angular CLI | 22.1.5                      |

Vérifier l'installation :

```bash
node -v
npm -v
```

L'Angular CLI n'a pas besoin d'être installée globalement : les commandes ci-dessous
utilisent `npx`, qui s'appuie sur la version déclarée dans le projet. Pour l'installer
globalement malgré tout :

```bash
npm install -g @angular/cli
```

## Installation

Cloner le dépôt, puis installer les dépendances depuis la racine du projet :

```bash
npm install
```

## Lancer l'application

```bash
npm start
```

L'application est disponible sur **http://localhost:4200** et se recharge
automatiquement à chaque modification.

Équivalent avec l'Angular CLI, en ouvrant directement le navigateur :

```bash
npx ng serve --open
```

Aucune clé d'API ni fichier de configuration n'est nécessaire : PokeAPI est
gratuite et publique.

## Autres commandes

```bash
npm run build
```

Compile l'application pour la production dans le dossier `dist/`.

```bash
npm test
```

Lance les tests unitaires (Vitest).

```bash
npx prettier --write "src/**/*.{ts,html,css}"
```

Reformate le code source.

## Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── pokemon-card/      Carte d'un Pokémon (affichage seul)
│   │   └── pokemon-list/      Liste, recherche et états de chargement
│   ├── models/
│   │   └── pokemon.model.ts   Interfaces TypeScript des données de l'API
│   ├── services/
│   │   └── pokemon.service.ts Appels HTTP vers PokeAPI
│   ├── app.config.ts          Providers (router, HttpClient)
│   ├── app.routes.ts          Déclaration des routes
│   ├── app.ts / .html / .css  Composant racine
│   └── styles.css             Styles globaux et variables CSS
└── index.html
```

La séparation suit les trois responsabilités demandées :

- **`services/`** — le seul endroit qui connaît l'API et importe `HttpClient` ;
- **`components/`** — l'affichage, qui ne manipule que des données déjà mises en forme ;
- **`models/`** — le typage des données échangées.

## Fonctionnement

```
PokemonService          PokemonList                PokemonCard
(HttpClient)            (état + recherche)         (affichage)

GET /pokemon?limit=151
      │
      │ map() : transforme la réponse brute
      │         en PokemonCardData[]
      ▼
  Observable ──subscribe──▶ pokemons  (signal)
                            searchTerm (signal)
                                  │
                                  │ computed()
                                  ▼
                            filteredPokemons ──[pokemon]──▶ carte
                                             ◀──(selected)──
```

1. `PokemonService` appelle l'API et transforme la réponse en un modèle prêt à afficher.
2. `PokemonList` s'abonne, stocke le résultat dans des signaux, et gère les états
   _chargement / erreur / résultats_.
3. La saisie de l'utilisateur passe par un flux RxJS (`debounceTime`,
   `distinctUntilChanged`) qui met à jour `searchTerm`.
4. `filteredPokemons` est un `computed()` : il se recalcule tout seul quand la liste
   ou le terme recherché change.
5. `PokemonCard` reçoit un Pokémon via `input.required()` et remonte le clic via
   `output()`.

## API utilisée

[PokeAPI](https://pokeapi.co/docs/v2) — gratuite, publique, sans clé, en lecture seule.

| Usage  | Endpoint                                                                            |
| ------ | ----------------------------------------------------------------------------------- |
| Liste  | `https://pokeapi.co/api/v2/pokemon?limit=151`                                       |
| Détail | `https://pokeapi.co/api/v2/pokemon/{nom-ou-id}`                                     |
| Images | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` |

## Choix techniques

**Un seul appel HTTP pour toute la liste.** L'endpoint liste ne renvoie ni image ni
identifiant, seulement un nom et une URL. Plutôt que d'appeler la fiche détaillée de
chaque Pokémon (151 requêtes supplémentaires), l'identifiant est extrait du dernier
segment de l'URL, ce qui permet de reconstruire l'adresse du sprite. Une seule requête
suffit donc pour afficher la liste complète avec ses images.

**Deux modèles distincts pour la liste.** `PokemonListItem` décrit la donnée brute
renvoyée par l'API, `PokemonCardData` décrit la donnée d'affichage. La transformation
est faite dans le service, via l'opérateur `map` de RxJS. Les composants ne dépendent
donc jamais de la forme exacte de la réponse : si l'API change, un seul fichier est
à modifier.

**151 Pokémon.** La première génération complète (ids 1 à 151), ce qui donne une
limite cohérente plutôt qu'un nombre arbitraire, et assez de contenu pour que la
recherche soit réellement utile.

**Recherche filtrée en local.** PokeAPI ne propose pas d'endpoint de recherche
partielle par nom. Les Pokémon étant déjà chargés, le filtrage se fait en mémoire :
le résultat est instantané et n'entraîne aucune requête réseau supplémentaire. La
saisie passe tout de même par `debounceTime` et `distinctUntilChanged` pour éviter
de recalculer le filtre à chaque touche.

**Typage strict.** `strict` et `strictTemplates` ont été activés dans `tsconfig.json`
(ils n'étaient pas dans la configuration générée). Le projet ne contient aucun `any` :
seuls les champs réellement affichés sont déclarés dans les interfaces, TypeScript
ignorant simplement les champs supplémentaires renvoyés par l'API.

**Désabonnement explicite.** L'abonnement au flux de recherche est stocké dans une
`Subscription` et libéré dans `ngOnDestroy()`, pour éviter toute fuite mémoire.

## Difficultés rencontrées

**Le mode zoneless.** Angular 22 se passe de Zone.js par défaut. Une simple propriété
de classe modifiée après une requête HTTP ne déclenche plus le rafraîchissement du
template : l'application restait bloquée sur « Chargement… » alors que la requête
répondait correctement. La solution a été de déclarer en `signal()` **toutes** les
variables lues dans les blocs `@if` et `@for` (`pokemons`, `loading`, `error`,
`searchTerm`), et de les mettre à jour avec `.set()`.

**Une erreur NG0203 trompeuse.** Une erreur `takeUntilDestroyed() can only be used
within an injection context` est apparue en console alors que le code était correct.
Elle venait en réalité du serveur de développement, qui avait rechargé à chaud une
seconde copie d'`@angular/core` en mémoire. Redémarrer `ng serve` a suffi à la faire
disparaître.

**Les images de la liste.** Comprendre que l'identifiant se trouvait dans l'URL
renvoyée par l'API a été l'étape clé pour éviter une multiplication des appels réseau.
