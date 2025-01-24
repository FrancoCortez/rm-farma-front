import { createAction, props } from '@ngrx/store';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { CommercialProductResourceDto } from '../../model/commercial-product/commercial-product-resource.dto';

export const loadCommercialProducts = createAction(
  '[CommercialProduct] Load CommercialProducts',
);
export const loadCommercialProductsSuccess = createAction(
  '[CommercialProduct] Load CommercialProducts Success',
  props<{ payload: CommercialProductResourceDto[] }>(),
);
export const loadCommercialProductsFailure = createAction(
  '[CommercialProduct] Load CommercialProducts Failure',
  props<{ error: ErrorModelDto }>(),
);
