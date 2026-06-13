import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DiagnosisResourceDto } from '../model/diagnosis/diagnosis-resource.dto';
import { DiagnosisCreateDto } from '../model/diagnosis/diagnosis-create.dto';
import { DiagnosisUpdateDto } from '../model/diagnosis/diagnosis-update.dto';
import { ComboModelDto } from '../utils/models/combo-model.dto';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAll(): Observable<DiagnosisResourceDto[]> {
    return this.http.get<DiagnosisResourceDto[]>(`${this.host}/diagnosis`);
  }

  public findAllDiagnosisWithCombo(): Observable<ComboModelDto[]> {
    return this.findAll().pipe(
      map((data: DiagnosisResourceDto[]) =>
        data.map(
          (item) =>
            ({
              code: item.code,
              name: item.description, // Aquí mapeamos 'name' a 'description'
            }) as ComboModelDto,
        ),
      ),
    );
  }

  public create(dto: DiagnosisCreateDto): Observable<DiagnosisResourceDto> {
    return this.http.post<DiagnosisResourceDto>(`${this.host}/diagnosis`, dto);
  }

  public update(
    id: string | undefined,
    dto: DiagnosisUpdateDto,
  ): Observable<DiagnosisResourceDto> {
    return this.http.patch<DiagnosisResourceDto>(
      `${this.host}/diagnosis/${id ?? ''}`,
      dto,
    );
  }

  public delete(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.host}/diagnosis/${id ?? ''}`);
  }
}
