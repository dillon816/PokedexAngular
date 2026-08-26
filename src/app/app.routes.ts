import { Routes } from '@angular/router';

import { PokemonList } from './components/pokemon-list/pokemon-list';

export const routes: Routes = [
  { path: '', component: PokemonList },
  // La route générique doit rester en dernière position.
  { path: '**', redirectTo: '' },
];
