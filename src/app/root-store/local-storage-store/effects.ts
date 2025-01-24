import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { exhaustMap, mergeMap } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';

export const loadLocalStore = createEffect(
  (actions$ = inject(Actions), localService = inject(LocalStorageService)) => {
    return actions$.pipe(
      ofType(actions.loadLocalStorage),
      exhaustMap(({ payload }) =>
        localService
          .readLocalStorage(payload)
          .pipe(
            mergeMap((payload: any) => [actions.loadLocalStorage({ payload })]),
          ),
      ),
    );
  },
  { functional: true },
);

export const saveLocalStore = createEffect(
  (actions$ = inject(Actions), localService = inject(LocalStorageService)) => {
    return actions$.pipe(
      ofType(actions.saveLocalStorage),
      exhaustMap(({ payload }) =>
        localService
          .saveLocalStorage(payload.key, payload.value)
          .pipe(
            mergeMap((payload: string) => [
              actions.loadLocalStorage({ payload }),
            ]),
          ),
      ),
    );
  },
  { functional: true },
);

export const saveOrderDetails = createEffect(
  (actions$ = inject(Actions), localService = inject(LocalStorageService)) => {
    return actions$.pipe(
      ofType(actions.saveLocalStorage),
      exhaustMap(({ payload }) =>
        localService
          .saveLocalStorage(payload.key, payload.value)
          .pipe(
            mergeMap((payload: string) => [
              actions.loadLocalStorage({ payload }),
            ]),
          ),
      ),
    );
  },
  { functional: true },
);
