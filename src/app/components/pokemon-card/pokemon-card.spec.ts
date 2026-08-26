import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCard } from './pokemon-card';
import { PokemonCardData } from '../../models/pokemon.model';

const pikachu: PokemonCardData = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.test/25.png',
};

describe('PokemonCard', () => {
  let component: PokemonCard;
  let fixture: ComponentFixture<PokemonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput('pokemon', pikachu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format the id on three digits', () => {
    expect(component.formattedId).toBe('#025');
  });
});
