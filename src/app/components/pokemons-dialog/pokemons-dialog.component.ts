import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-pokemons-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,MaterialModule],
  providers: [PokemonService],
  templateUrl: './pokemons-dialog.component.html',
  styleUrls: ['./pokemons-dialog.component.scss']
})
export default class PokemonsDialogComponent implements OnInit, OnDestroy {
  pokemon: any;
  animationArray: string[] = [];
  indiceActual: number = 0;
  animating: boolean = false;
  private animationInterval: any; // Intervalo de animación
  pokemonImagenActual: string = ''; // Variable para almacenar la imagen actual

  constructor(
    private pokemonService: PokemonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pokemonService.getPokemon(this.data.id).subscribe({
      next: (response: any) => {
        this.pokemon = response;

        // Configurar animaciones si están disponibles
        if (response.sprites && response.sprites.front_default && response.sprites.back_default) {
          this.animationArray = [
            response.sprites.front_default,
            response.sprites.back_default
          ];
          this.iniciarAnimacion(); // Iniciar animación si hay imágenes
        } else {
          this.animationArray = [];
        }
      },
      error: (err: any) => {
        console.error('Error al obtener Pokémon:', err);
        this.openSnackBarError();
        this.animationArray = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  playSound(soundSource: string) {
    if (soundSource) {
      const audio = new Audio(soundSource);
      audio.play().catch(err => console.error('Error al reproducir el sonido:', err));
    }
  }

  openSnackBarError() {
    this._snackBar.open('Nombre o id de pokemon no válido', 'Cerrar', { duration: 3000 });
  }

  iniciarAnimacion() {
    this.indiceActual = 0;
    this.animating = true;
    this.pokemonImagenActual = this.animationArray[0]; // Inicializar la imagen actual
    this.animateFrames();
  }

  animateFrames() {
    if (this.animating) {
      this.animationInterval = setInterval(() => {
        try {
          this.indiceActual =
            (this.indiceActual + 1) % this.animationArray.length;
          this.pokemonImagenActual = this.animationArray[this.indiceActual]; // Actualizar la imagen actual
        } catch (error) {
          this.detenerAnimacion();
          console.error('Error en la animación:', error);
        }
      }, 300);
    }
  }

  detenerAnimacion() {
    this.animating = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
