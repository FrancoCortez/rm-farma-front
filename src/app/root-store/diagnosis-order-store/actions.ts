import { createAction, props } from '@ngrx/store';
import { DiagnosisOrderStateFormResourceDto } from '../../model/diagnosis-order-state/diagnosis-order-state-form-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const createDiagnosisOrder = createAction(
  '[DiagnosisOrder] Create DiagnosisOrder',
  props<{ payload: DiagnosisOrderStateFormResourceDto }>(),
);

export const createDiagnosisOrderSuccess = createAction(
  '[DiagnosisOrder] Create DiagnosisOrder Success',
);
export const createDiagnosisOrderFailure = createAction(
  '[DiagnosisOrder] Create DiagnosisOrder Failure',
  props<{ error: ErrorModelDto }>(),
);

export const setStatusCreateDiagnosisOrder = createAction(
  '[DiagnosisOrder] Set Status Create DiagnosisOrder',
  props<{ payload: boolean }>(),
);
