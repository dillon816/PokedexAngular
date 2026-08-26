/**
 * Typage des données échangées avec PokeAPI.
 * On ne déclare que les champs réellement utilisés par l'application :
 * TypeScript ignore simplement les champs supplémentaires renvoyés par l'API.
 */

/** Réponse brute de GET /pokemon?limit=20 */
export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

/** Une entrée de la liste : l'API ne renvoie qu'un nom et une URL, pas d'image. */
export interface PokemonListItem {
  name: string;
  url: string;
}

/**
 * Modèle enrichi consommé par les composants.
 * Construit dans le service à partir d'un PokemonListItem :
 * l'identifiant est extrait de l'URL, l'image en est déduite.
 */
export interface PokemonCardData {
  id: number;
  name: string;
  imageUrl: string;
}

/** Un type de Pokémon tel qu'imbriqué dans la réponse détail. */
export interface PokemonType {
  type: {
    name: string;
  };
}

/** Une statistique de base (valeur + libellé). */
export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

/** Réponse de GET /pokemon/{nom-ou-id}, réduite aux champs affichés. */
export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: PokemonType[];
  stats: PokemonStat[];
}
