import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { EmailValidation } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'emailValidation',

  state: {
    status: [],
  },

  effects: {
    *emailValidation({ payload }, { call, put }) {
    //   const response = yield call(EmailValidation, payload);
    //   yield put({
    //    type: 'changeEmailValidation',
    //     payload: response,
    //   });
    }
  },

  reducers: {
    changeEmailValidation(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
  },
};