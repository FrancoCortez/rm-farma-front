import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { DiagnosisResourceDto } from '../model/diagnosis/diagnosis-resource.dto';
import { ComboModelDto } from '../utils/models/combo-model.dto';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllDiagnosis(): Observable<DiagnosisResourceDto[]> {
    return this.http.get<DiagnosisResourceDto[]>(`${this.host}/diagnosis`);
  }

  public findAllDiagnosisWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<DiagnosisResourceDto[]>(`${this.host}/diagnosis`).pipe(
      map((diagnosis: DiagnosisResourceDto[]) =>
        diagnosis.map((diagnosiss: DiagnosisResourceDto) => ({
          code: diagnosiss.code,
          name: diagnosiss.description,
        })),
      ),
    );
  }
}
