import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonPersonService {

  private pokemonesSource = new BehaviorSubject<any>({});
  pokemones$ = this.pokemonesSource.asObservable();

  setPokemones(pokemones: any) {
    this.pokemonesSource.next(pokemones);
  }
}
