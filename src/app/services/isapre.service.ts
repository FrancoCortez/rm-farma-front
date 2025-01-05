import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { IsapreResourceDto } from '../model/isapre/isapre-resource.dto';
import { ComboModelDto } from '../utils/models/combo-model.dto';

@Injectable({
  providedIn: 'root',
})
export class IsapreService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllIsapres(): Observable<IsapreResourceDto[]> {
    return this.http.get<IsapreResourceDto[]>(`${this.host}/isapres`);
  }

  public findAllIsapreWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<IsapreResourceDto[]>(`${this.host}/isapres`).pipe(
      map((isapres: IsapreResourceDto[]) =>
        isapres.map((isapre: IsapreResourceDto) => ({
          code: isapre.code,
          name: isapre.description,
        })),
      ),
    );
  }
}
