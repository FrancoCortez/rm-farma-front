import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.commercialProduct;

export const selectCommercialProduct = createSelector(
  selector,
  (state) => state.commercialProducts,
);
