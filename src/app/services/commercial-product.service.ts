import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommercialProductResourceDto } from '../model/commercial-product/commercial-product-resource.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommercialProductService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllCommercialProducts(): Observable<
    CommercialProductResourceDto[]
  > {
    return this.http.get<CommercialProductResourceDto[]>(
      `${this.host}/commercial-product`,
    );
  }
}
