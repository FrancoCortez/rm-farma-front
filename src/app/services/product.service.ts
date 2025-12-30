import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductResourceDto } from '../model/product/product-resource.dto';
import { ActiveIngredientCreateDto } from '../model/product/active-ingredient-create.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private host = environment.hostRmFarma;

  constructor(private http: HttpClient) {}

  public findAllProducts(): Observable<ProductResourceDto[]> {
    return this.http.get<ProductResourceDto[]>(`${this.host}/products`);
  }

  createActiveIngredient(
    createDto: ActiveIngredientCreateDto,
  ): Observable<ProductResourceDto> {
    return this.http.post<ProductResourceDto>(
      `${this.host}/products`,
      createDto,
    );
  }
}
