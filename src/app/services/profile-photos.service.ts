import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotosService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getPhotos(): Observable<any[]> {
    return this.httpClient.get<any[]>('../../assets/images/characters/images.json')
  }
}
