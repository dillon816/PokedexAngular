import { Routes } from '@angular/router';

import { PokemonDetail } from './components/pokemon-detail/pokemon-detail';
import { PokemonList } from './components/pokemon-list/pokemon-list';

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:id', component: PokemonDetail },
  // La route générique doit rester en dernière position.
  { path: '**', redirectTo: '' },
];
