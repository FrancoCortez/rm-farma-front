import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.product;

export const selectLoading = createSelector(selector, (state) => state.loading);

export const selectProduct = createSelector(
  selector,
  (state) => state.products,
);
