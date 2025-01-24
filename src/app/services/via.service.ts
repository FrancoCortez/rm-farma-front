import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ComboModelDto } from '../utils/models/combo-model.dto';
import { ViaResourceDto } from '../model/via/via-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class ViaService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllViaWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<ViaResourceDto[]>(`${this.host}/vias`).pipe(
      map((vias: ViaResourceDto[]) =>
        vias.map((via) => ({
          code: via.code,
          name: via.description,
        })),
      ),
    );
  }
}
