import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DoctorResourceDto } from '../model/doctor/doctor-resource.dto';
import { DoctorCreateResourceDto } from '../model/doctor/doctor-create-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findDoctorByRut(rut: string): Observable<DoctorResourceDto> {
    return this.http.get<DoctorResourceDto>(
      `${this.host}/doctor/find-by-rut/${rut}`,
    );
  }

  public findAllDoctors(): Observable<DoctorResourceDto[]> {
    return this.http.get<DoctorResourceDto[]>(`${this.host}/doctor`);
  }

  public createDoctor(
    doctor: DoctorCreateResourceDto,
  ): Observable<DoctorResourceDto> {
    return this.http.post<DoctorResourceDto>(`${this.host}/doctor`, doctor);
  }
}
