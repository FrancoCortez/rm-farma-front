import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ComplementResourceDto } from '../model/complement/complement-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class ComplementService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllComplements(): Observable<ComplementResourceDto[]> {
    return this.http.get<ComplementResourceDto[]>(`${this.host}/complements`);
  }
}
