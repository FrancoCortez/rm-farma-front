import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsReportResourceDto } from '../model/master-order-details/order-details-report.resource.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {
  private host = environment.hostRmFarma;
  constructor(private readonly http: HttpClient) {}

  public customReport(): Observable<OrderDetailsReportResourceDto[]> {
    return this.http.get<OrderDetailsReportResourceDto[]>(
      `${this.host}/order-details/generate/custom-report`,
    );
  }
}
