import { createAction, props } from '@ngrx/store';
import { ProductResourceDto } from '../../model/product/product-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadProduct = createAction('[Product] Load Product');
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ payload: ProductResourceDto[] }>(),
);
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: ErrorModelDto }>(),
);
