import { AllCurrency } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'allCurrency',

  state: {
    allCurrency: [],
  },

  effects: {
    *getAllCurrency({ payload }, { call, put }) {
      const response = yield call(AllCurrency, payload);
      yield put({
       type: 'changeAllCurrency',
        payload: response,
      });
    },
  },

  reducers: {
    changeAllCurrency(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        allCurrency: payload,
      };
    },
  },
};