import { Component, inject, OnInit, signal } from '@angular/core';

import { PokemonCard } from '../pokemon-card/pokemon-card';
import { PokemonCardData } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  imports: [PokemonCard],
  selector: 'app-pokemon-list',
  styleUrl: './pokemon-list.css',
  templateUrl: './pokemon-list.html',
})
export class PokemonList implements OnInit {
  private pokemonService = inject(PokemonService);

  /**
   * Le projet est en mode zoneless : toute valeur lue dans un @if ou un @for
   * doit être un signal pour que le template soit notifié après l'appel HTTP.
   */
  pokemons = signal<PokemonCardData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonList().subscribe({
      next: (pokemons) => {
        this.pokemons.set(pokemons);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de contacter l'API PokeAPI.");
        this.loading.set(false);
      },
    });
  }

  onPokemonSelected(pokemon: PokemonCardData): void {
    console.log('Pokémon sélectionné :', pokemon.name);
  }
}
