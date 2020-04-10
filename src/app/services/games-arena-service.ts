import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GamesArenaService {
  constructor(private http: HttpClient) { }

  getGamesData() {
    const API_ENDPOINT = 'http://starlord.hackerearth.com/';
    const HTTP_OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(API_ENDPOINT + 'gamesarena', HTTP_OPTIONS);
  }
}