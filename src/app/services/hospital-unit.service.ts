import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HospitalUnitResourceDto } from '../model/hospital-unit/hospital-unit-resource.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalUnitService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllHospitalUnit(): Observable<HospitalUnitResourceDto[]> {
    return this.http
      .get<HospitalUnitResourceDto[]>(`${this.host}/hospital-units`)
      .pipe(
        map((hospitalUnits: HospitalUnitResourceDto[]) =>
          hospitalUnits.map((hospitalUnit) => ({
            code: hospitalUnit.code,
            name: hospitalUnit.description,
          })),
        ),
      );
  }
}
