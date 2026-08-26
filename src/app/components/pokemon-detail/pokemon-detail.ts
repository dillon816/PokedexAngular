import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PokemonDetailData } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

/** Valeur maximale théorique d'une statistique, utilisée pour les barres. */
const MAX_STAT = 255;

const STAT_LABELS: Record<string, string> = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  'special-attack': 'Attaque Spé.',
  'special-defense': 'Défense Spé.',
  speed: 'Vitesse',
};

@Component({
  imports: [RouterLink],
  selector: 'app-pokemon-detail',
  styleUrl: './pokemon-detail.css',
  templateUrl: './pokemon-detail.html',
})
export class PokemonDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  pokemon = signal<PokemonDetailData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  /** L'API renvoie parfois un sprite vide : on retombe sur l'image de la liste. */
  imageUrl = computed(() => {
    const pokemon = this.pokemon();

    if (pokemon === null) {
      return '';
    }

    return pokemon.sprites.front_default ?? this.pokemonService.getSpriteUrl(pokemon.id);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.error.set('Aucun Pokémon demandé.');
      this.loading.set(false);
      return;
    }

    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (pokemon) => {
        this.pokemon.set(pokemon);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Ce Pokémon est introuvable ou l'API ne répond pas.");
        this.loading.set(false);
      },
    });
  }

  statLabel(name: string): string {
    return STAT_LABELS[name] ?? name;
  }

  statPercent(value: number): number {
    return (value / MAX_STAT) * 100;
  }
}
