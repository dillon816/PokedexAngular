import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PokemonDetail } from './pokemon-detail';

describe('PokemonDetail', () => {
  let component: PokemonDetail;
  let fixture: ComponentFixture<PokemonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetail],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert a stat into a percentage of the maximum', () => {
    expect(component.statPercent(255)).toBe(100);
  });
});
