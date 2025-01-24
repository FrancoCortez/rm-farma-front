import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ComboModelDto } from '../utils/models/combo-model.dto';
import { ServiceResourceDto } from '../model/services/service-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllServicesWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<ServiceResourceDto[]>(`${this.host}/services`).pipe(
      map((services: ServiceResourceDto[]) =>
        services.map((service) => ({
          code: service.code,
          name: service.description,
        })),
      ),
    );
  }
}
