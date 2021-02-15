import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(){
    const heroes = [
      { id:11, name: 'Yawara' },
      { id:12, name: 'Naruto' },
      { id:13, name: 'Tomoko' },
      { id:14, name: 'Markku' },
      { id:15, name: 'Inoki' },
      { id:16, name: 'Mr Bomb' },
      { id:17, name: 'Mari' },
      { id:18, name: 'Susanna' },
      { id:19, name: 'Vincent' },
      { id:20, name: 'Ray' }
    ];

    return { heroes };

  }

    // Overrides the genId method to ensure that a hero always has an id.
    // If the heroes array is empty,
    // the method below returns the initial number (11).
    // if the heroes array is not empty, the method below returns the highest
    // hero id + 1.

    genId(heroes: Hero[]): number {
      return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1:11;
    }

}
