import { Component, input, output } from '@angular/core';

import { PokemonCardData } from '../../models/pokemon.model';

@Component({
  imports: [],
  selector: 'app-pokemon-card',
  styleUrl: './pokemon-card.css',
  templateUrl: './pokemon-card.html',
})
export class PokemonCard {
  pokemon = input.required<PokemonCardData>();
  selected = output<PokemonCardData>();

  onSelect(): void {
    this.selected.emit(this.pokemon());
  }

  get formattedId(): string {
    return `#${this.pokemon().id.toString().padStart(3, '0')}`;
  }
}
