import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsDialogComponent } from './pokemons-dialog.component';

describe('PokemonsDialogComponent', () => {
  let component: PokemonsDialogComponent;
  let fixture: ComponentFixture<PokemonsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
