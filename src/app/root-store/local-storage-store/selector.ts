import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.localStorage;

export const selectLoading = createSelector(selector, (state) => state.loading);
