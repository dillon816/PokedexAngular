/** Réponse brute de GET /pokemon?limit=20 */
export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonCardData {
  id: number;
  name: string;
  imageUrl: string;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

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
