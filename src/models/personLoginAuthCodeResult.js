import { PersonLoginAuthCodeResult } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'personLoginAuthCodeResult',

  state: {
    personLoginAuthCodeResult: [],
  },

  effects: {
    *getPersonLoginAuthCodeResult({ payload }, { call, put }) {
      const response = yield call(PersonLoginAuthCodeResult, payload);
      yield put({
       type: 'changePersonLoginAuthCodeResult',
        payload: response,
      });
    },
  },

  reducers: {
    changePersonLoginAuthCodeResult(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        personLoginAuthCodeResult: payload,
      };
    },
  },
};