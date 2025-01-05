import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ClinicResourceDto } from '../model/clinic/clinic-resource.dto';
import { ComboModelDto } from '../utils/models/combo-model.dto';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllClinics(): Observable<ClinicResourceDto[]> {
    return this.http.get<ClinicResourceDto[]>(`${this.host}/clinics`);
  }

  public findAllClinicWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<ClinicResourceDto[]>(`${this.host}/clinics`).pipe(
      map((clinics: ClinicResourceDto[]) =>
        clinics.map((clinic: ClinicResourceDto) => ({
          code: clinic.code,
          name: clinic.description,
        })),
      ),
    );
  }
}
