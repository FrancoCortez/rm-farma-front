import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReportRecipeBookDto } from '../model/general-report/report-recipe-book.dto';
import { map, Observable } from 'rxjs';
import {
  formatDate,
  formatDateTimeSeparated,
} from '../utils/form-validation/format-date';
import { ChemotherapyPreparationFormDto } from '../model/general-report/chemotherapy-preparation-form.dto';

@Injectable({
  providedIn: 'root',
})
export class GeneralReportService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public reportRecipeBook(
    startDate: Date,
    endDate: Date,
  ): Observable<ReportRecipeBookDto[]> {
    let params = new HttpParams();
    params = params.set('startDate', startDate.toISOString());
    params = params.set('endDate', endDate.toISOString());
    return this.http
      .get<
        ReportRecipeBookDto[]
      >(`${this.host}/general-reports/recipe-book`, { params })
      .pipe(
        map((res: ReportRecipeBookDto[]) => {
          return res.map((report) => {
            return {
              ...report,
              productionDate: report.productionDate
                ? formatDate(report.productionDate as Date)
                : undefined,
              expirationDate: report.expirationDate
                ? formatDate(report.expirationDate as Date)
                : undefined,
            };
          });
        }),
      );
  }

  public reportChemotherapyPreparationFormReport(
    startDate: Date,
    endDate: Date,
  ) {
    let params = new HttpParams();
    params = params.set('startDate', startDate.toISOString());
    params = params.set('endDate', endDate.toISOString());
    return this.http
      .get<
        ReportRecipeBookDto[]
      >(`${this.host}/general-reports/chemotherapy-preparation-form`, { params })
      .pipe(
        map((res: ChemotherapyPreparationFormDto[]) => {
          return res.map((report) => {
            return {
              ...report,
              productionDate: formatDateTimeSeparated(report.productionDate)
                .formattedDate,
              productionDateHour: formatDateTimeSeparated(report.productionDate)
                .formattedTime,
              expirationDate: formatDateTimeSeparated(report.expirationDate)
                .formattedDate,
              expirationAdministrationDate: formatDateTimeSeparated(
                report.expirationAdministrationDate,
              ).formattedDate,
              expirationAdministrationDateHour: formatDateTimeSeparated(
                report.expirationAdministrationDate,
              ).formattedTime,
              administrationDate: formatDateTimeSeparated(
                report.administrationDate,
              ).formattedDate,
            };
          });
        }),
      );
  }
}
