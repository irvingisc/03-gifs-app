import { SearchGifsResponse } from './../interfaces/gifs.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifsList: Gif[] = [];

  private apiKey: string = 'LK4gelIUb0xV4L4S9jTou7MdOvC4hXUl';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private _tagsHistory: string[]= [];

  constructor( private http: HttpClient ) {

    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory( tag: string ) {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();

  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {

    if( !localStorage.getItem('history') ){
      return;
    }
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if( this._tagsHistory.length === 0) return;

    this.searchTag( this._tagsHistory[0] );

  }

  searchTag( tag: string ) : void {

    if ( tag.length === 0 ) return;

    this.organizeHistory( tag );

    const params = new HttpParams()
    .set( 'api_key', this.apiKey )
    .set( 'limit' , '10')
    .set('q', tag);

    this.http.get<SearchGifsResponse>(`${ this.serviceUrl }/search`, { params })
        .subscribe( resp => {

          this.gifsList = resp.data;

        });
  }

}
