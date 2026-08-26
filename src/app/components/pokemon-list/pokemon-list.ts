import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

import { PokemonCard } from '../pokemon-card/pokemon-card';
import { PokemonCardData } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  imports: [PokemonCard],
  selector: 'app-pokemon-list',
  styleUrl: './pokemon-list.css',
  templateUrl: './pokemon-list.html',
})
export class PokemonList implements OnInit, OnDestroy {
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  /**
   * Le projet est en mode zoneless : toute valeur lue dans un @if ou un @for
   * doit être un signal pour que le template soit notifié après l'appel HTTP.
   */
  pokemons = signal<PokemonCardData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  /** La liste affichée découle de la liste chargée et du terme recherché. */
  filteredPokemons = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (term === '') {
      return this.pokemons();
    }

    return this.pokemons().filter((pokemon) => pokemon.name.includes(term));
  });

  private searchInput$ = new Subject<string>();
  private searchSubscription: Subscription;

  constructor() {
    // debounceTime évite de filtrer à chaque frappe, distinctUntilChanged ignore
    // une saisie identique à la précédente (support p.38).
    this.searchSubscription = this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.searchTerm.set(term));
  }

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
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

  onSearch(event: Event): void {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onPokemonSelected(pokemon: PokemonCardData): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
