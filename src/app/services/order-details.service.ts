import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsReportResourceDto } from '../model/master-order-details/order-details-report.resource.dto';
import { MasterOrderDetailsUpdateFormResourceDto } from '../model/master-order-details/master-order-details-update-form-resource.dto';
import { OrderDetailsResumeReportResourceDto } from '../model/master-order-details/order-details-resume-report.resource.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {
  private host = environment.hostRmFarma;
  constructor(private readonly http: HttpClient) {}

  public customReport(
    startDate: Date,
    endDate: Date,
  ): Observable<OrderDetailsReportResourceDto[]> {
    let params = new HttpParams();
    params = params.set('startDate', startDate.toISOString());
    params = params.set('endDate', endDate.toISOString());
    console.log(params);
    return this.http.get<OrderDetailsReportResourceDto[]>(
      `${this.host}/order-details/generate/custom-report`,
      { params },
    );
  }

  public customResumeReport(
    startDate: Date,
    endDate: Date,
  ): Observable<OrderDetailsResumeReportResourceDto[]> {
    let params = new HttpParams();
    params = params.set('startDate', startDate.toISOString());
    params = params.set('endDate', endDate.toISOString());
    console.log(params);
    return this.http.get<OrderDetailsResumeReportResourceDto[]>(
      `${this.host}/order-details/generate/resume-report`,
      { params },
    );
  }

  public updateDetail(body: MasterOrderDetailsUpdateFormResourceDto) {
    return this.http.put(`${this.host}/order-details/update`, body);
  }
}
