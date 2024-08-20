import { ChangeDetectionStrategy, Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MaterialModule } from '../../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PokemonPersonService } from '../../services/pokemon-person.service';
import PokemonsDialogComponent from '../pokemons-dialog/pokemons-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [MaterialModule],
  providers: [PokemonService],
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],  // Corrección aquí
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonListComponent implements OnDestroy {
  pokemonNameOrId = signal('');
  loading = signal(false);
  pokemons = signal<any[]>([]);  // Lista de Pokémon que se va a mostrar
  animationArray = signal<string[]>([]);
  indiceActual = signal(0);
  animating = signal(false);
  contador = signal<number[]>([]);



  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });


  constructor(
    private dialog: MatDialog,
    private pokemonService: PokemonService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  playSound(soundSource: string) {
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }

  loadPokemon() {
    const count = 20; // Valor fijo para la cantidad de Pokémon
  
    this.detenerAnimacion();
    this.loading.set(true);
    this.pokemons.set([]);
  
    const requests = Array.from({ length: count }, () => this.pokemonService.getPokemon(this.generateRandomPokemonId().toString()));
  
    forkJoin(requests).subscribe({
      next: (pokemons: any[]) => {
        this.pokemons.set(pokemons);
        this.loading.set(false);
  
        // Aplicar animaciones y sonidos para todos los Pokémon
        if (pokemons.length > 0) {
          // Mostrar animaciones para todos los Pokémon
          // Puedes personalizar esto según el número de Pokémon y el tipo de animación que quieras aplicar
          const animationArray = pokemons.map(pokemon => [
            pokemon.sprites.front_default,
            pokemon.sprites.back_default
          ]);
  
          this.animationArray.set(animationArray.flat()); // Aplanar el array de arrays
          this.iniciarAnimacion();
          
          // Reproducir sonidos para todos los Pokémon
          pokemons.forEach(pokemon => {
            this.playSound(pokemon.cries.latest);
          });
        }
  
      },
      error: (err: any) => {
        console.log(err);
        this.openSnackBarError();
        this.loading.set(false);
        // Aquí podrías agregar alguna lógica de animación en caso de error si es necesario
      }
    });
  }
  


  generateRandomPokemonId(): number {
    return Math.floor(Math.random() * 649) + 1; // Asumiendo que hay 898 Pokémon
  }

  openSnackBarError() {
    this._snackBar.open('Error al cargar los Pokémon. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
  }

  openSnackSinData() {
    this._snackBar.open('Escriba una cantidad válida para cargar Pokémon', 'Cerrar', { duration: 3000 });
  }

  iniciarAnimacion() {
    this.indiceActual.set(0);
    this.animating.set(true);
    this.animateFrames();
  }

  animateFrames() {
    setTimeout(() => {
      if (this.animating()) {
        this.indiceActual.update(index => (index + 1) % this.animationArray().length);
        this.animateFrames();
      }
    }, 300);
  }

  detenerAnimacion() {
    this.animating.set(false);
  }

  updateName(name: string) {
    this.pokemonNameOrId.set(name.toLowerCase());
  }

  playSoundOnClick() {
    this.pokemons().forEach(pokemon => {
      if (pokemon.cries?.latest) {
        this.playSound(pokemon.cries.latest);
      }
    });
  }
  isLast(item: any, list: any[]): boolean {
    return list[list.length - 1] === item;
  }

  openDialog(id: any): void {
    this.dialog.open(PokemonsDialogComponent, {
      data: {
        id,
        
      },
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
