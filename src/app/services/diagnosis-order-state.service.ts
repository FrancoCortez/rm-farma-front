import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DiagnosisOrderStateFormResourceDto } from '../model/diagnosis-order-state/diagnosis-order-state-form-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisOrderStateService {
  private host = environment.hostRmFarma;
  constructor(private http: HttpClient) {}

  createDiagnosisOrder(body: DiagnosisOrderStateFormResourceDto) {
    return this.http.post(`${this.host}/diagnosis-order-stages`, body);
  }
}
