import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; //web API's URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (

    private http: HttpClient,
    private MessageService: MessageService) {}

    getHeroes(): Observable<Hero[]>{
      //TODO: send the message _after_ fetching the heroes
      return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeros',[]))
      );
    }

    getHeroNo404<Data>(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/?id=${id}`;
      return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]),
        tap(h => {
          const outcome = h ? `fetched`: `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
    }
    getHero(id: number): Observable<Hero> {
      // TODO: send the message _after_ fetching the hero
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
         tap(_ => this.log(`fetched hero id=${id}`)),
         catchError(this.handleError<Hero>(`getHero id=${id}`))
       );
    }

    serchHeroes(term: string): Observable<Hero[]> {
      if (!term.trim()){
        return of ([]);
    }
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(_ => this.log(`found heroes matching "${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes',[]))
      );
    }
    
    // save methods
    addHero( hero: Hero ): Observable<Hero> {
      return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
        tap((newHero: Hero) => this.log(`add hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
    }

    //delete
    deleteHero(hero: Hero | number) : Observable<Hero> {
      const id = typeof hero === 'number' ? hero : hero.id;
      const url = `${this.heroesUrl}/${id}`;

      return this.http.delete<Hero>(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
    }

    // update
    updateHero(hero: Hero): Observable<any> {
      return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
        tap(_ => this.log(`update hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
    }

    private handleError<T>(operation = 'operation', result?: T){
      return (error: any): Observable<T> => {
        console.log(error);

        this.log(`${operation} failed: ${error.message}`);

        return of (result as T);
      };
    }

    private log(message: string){
      this.MessageService.add(`HeroService: ${message}`);
    }

  }
