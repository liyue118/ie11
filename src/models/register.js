import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {message, Alert} from 'antd';
import { RegisterAccount } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'register',

  state: {
    status: [],
  },

  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(RegisterAccount, payload);
      yield put({
       type: 'changeRegisterStatus',
        payload: response,
      });
      //register successfully
      if (response.ReturnCode == '1001') {
        reloadAuthorized();
        message.success('Registered successfully, please log in!')
        yield put(routerRedux.push('/user/login'));
      }
      if (response.ReturnCode == '1000') {
        message.warn(response.Message);
      }
    },
  },

  reducers: {
    changeRegisterStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload,
      };
    },
  },
};