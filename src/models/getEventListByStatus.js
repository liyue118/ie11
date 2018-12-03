import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {message} from 'antd';
import { getEventListByStatus } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'getEventListByStatus',

  state: {
    getEventListByStatus: [],
  },

  effects: {
    *getEventListByStatus({ payload }, { call, put }) {
      const response = yield call(getEventListByStatus, payload);
      yield put({
       type: 'changeEventListByStatus',
        payload: response,
      });
      //register successfully
      if (response.ReturnCode == '1001') {
        reloadAuthorized();
        message.success('Registered successfully, please log in!')
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeEventListByStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        getEventListByStatus: payload,
      };
    },
  },
};