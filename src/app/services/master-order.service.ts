import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MasterOrderResourceDto } from '../model/master-order/master-order-resource.dto';
import { MasterOrderFormResourceDto } from '../model/master-order/master-order-form-resource.dto';

@Injectable({
  providedIn: 'root',
})
export class MasterOrderService {
  private host = environment.hostRmFarma;

  constructor(private readonly http: HttpClient) {}

  public findAllMasterOrders(
    searchDay: Date,
    searchIdentification: string,
  ): Observable<MasterOrderResourceDto[]> {
    let params = new HttpParams();
    if (searchDay) {
      params = params.set('searchDay', searchDay.toISOString());
    }
    if (searchIdentification) {
      params = params.set('searchIdentification', searchIdentification);
    }
    return this.http.get<MasterOrderResourceDto[]>(
      `${this.host}/master-order`,
      { params },
    );
  }

  public createMasterOrder(
    body: MasterOrderFormResourceDto[],
  ): Observable<MasterOrderResourceDto> {
    return this.http.post(`${this.host}/master-order`, body);
  }

  public findAllHistoryMasterOrders(identification: string, diagnosisOrder: string): Observable<MasterOrderResourceDto[]>  {
    let params = new HttpParams();
    if (identification) {
      params = params.set('identification', identification);
      params = params.set('diagnosisId', diagnosisOrder);
    }
    return this.http.get<MasterOrderResourceDto[]>(
      `${this.host}/master-order/find-history`, { params }
    );
  }
}
