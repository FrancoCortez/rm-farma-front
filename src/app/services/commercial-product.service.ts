import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommercialProductResourceDto } from '../model/commercial-product/commercial-product-resource.dto';
import { Observable } from 'rxjs';
import { CommercialProductCreateDto } from '../model/commercial-product/commercial-product-create.dto';

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

  createCommercialProduct(
    createDto: CommercialProductCreateDto,
  ): Observable<CommercialProductResourceDto> {
    return this.http.post<CommercialProductResourceDto>(
      `${this.host}/commercial-product`,
      createDto,
    );
  }
}
