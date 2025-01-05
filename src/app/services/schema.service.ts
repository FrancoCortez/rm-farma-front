import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { SchemaResourceDto } from '../model/schema/schema-resource.dto';
import { ComboModelDto } from '../utils/models/combo-model.dto';
import { ClinicResourceDto } from '../model/clinic/clinic-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private host = environment.hostRmFarma;
  constructor(private http: HttpClient) {}

  public findAllSchemas(): Observable<SchemaResourceDto[]> {
    return this.http.get<SchemaResourceDto[]>(`${this.host}/schemas`);
  }

  public findAllSchemasWithCombo(): Observable<ComboModelDto[]> {
    return this.http.get<ClinicResourceDto[]>(`${this.host}/schemas`).pipe(
      map((schemas: SchemaResourceDto[]) =>
        schemas.map((schema) => ({
          code: schema.code,
          name: schema.description,
        })),
      ),
    );
  }
}
