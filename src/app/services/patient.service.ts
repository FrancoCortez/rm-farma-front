import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PatientFormResourceDto } from '../model/patient/patient-form-resource.dto';
import { Observable } from 'rxjs';
import { PatientResourceDto } from '../model/patient/patient-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private host = environment.hostRmFarma;

  constructor(private readonly http: HttpClient) {}

  public createPatient(
    patientForm: PatientFormResourceDto,
  ): Observable<PatientResourceDto> {
    return this.http.post<PatientResourceDto>(
      `${this.host}/patients`,
      patientForm,
    );
  }

  public findByIdentificationPatent(
    identification: string,
  ): Observable<PatientResourceDto> {
    return this.http.get<PatientResourceDto>(
      `${this.host}/patients/identification/${identification}`,
    );
  }

  public findAllPatients(): Observable<PatientResourceDto[]> {
    return this.http.get<PatientResourceDto[]>(`${this.host}/patients`);
  }
}
