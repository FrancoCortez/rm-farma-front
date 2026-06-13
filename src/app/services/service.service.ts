import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceResourceDto } from '../model/service/service-resource.dto';
import { ServiceCreateDto } from '../model/service/service-create.dto';
import { ServiceUpdateDto } from '../model/service/service-update.dto';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAll(): Observable<ServiceResourceDto[]> {
    return this.http.get<ServiceResourceDto[]>(`${this.host}/services`);
  }

  public create(service: ServiceCreateDto): Observable<ServiceResourceDto> {
    return this.http.post<ServiceResourceDto>(`${this.host}/services`, service);
  }

  public update(
    id: string | undefined,
    service: ServiceUpdateDto,
  ): Observable<ServiceResourceDto> {
    return this.http.patch<ServiceResourceDto>(
      `${this.host}/services/${id ?? ''}`,
      service,
    );
  }

  public delete(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.host}/services/${id ?? ''}`);
  }
}
