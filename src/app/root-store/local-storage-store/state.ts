export class State {
  loading!: boolean;
  isLoader!: boolean;
  masterOrderDetails: any[] = [];
  masterOrdersForm: any;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  masterOrderDetails: [],
  masterOrdersForm: null,
};
