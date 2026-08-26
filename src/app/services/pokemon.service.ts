import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  PokemonCardData,
  PokemonDetail,
  PokemonListItem,
  PokemonListResponse,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private readonly spriteUrl =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

  /**
   * Un seul appel HTTP pour toute la liste : l'identifiant est extrait de
   * l'URL renvoyée par l'API, ce qui permet d'en déduire l'image.
   */
  getPokemonList(limit = 151): Observable<PokemonCardData[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`)
      .pipe(map((response) => response.results.map((item) => this.toCardData(item))));
  }

  getPokemonDetail(idOrName: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${idOrName}`);
  }

  private toCardData(item: PokemonListItem): PokemonCardData {
    const id = this.extractId(item.url);

    return {
      id,
      name: item.name,
      imageUrl: `${this.spriteUrl}/${id}.png`,
    };
  }

  /** L'URL se termine par l'identifiant : .../pokemon/25/ */
  private extractId(url: string): number {
    const segments = url.split('/').filter((segment) => segment !== '');

    return Number(segments[segments.length - 1]);
  }
}
