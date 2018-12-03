import { EventVenueEdit } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventVenueEdit',

  state: {
    eventVenueEdit: [],
  },

  effects: {
    *getEventVenueEdit({ payload }, { call, put }) {
      const response = yield call(EventVenueEdit, payload);
      yield put({
       type: 'changeEventVenueEdit',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventVenueEdit(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventVenueEdit: payload,
      };
    },
  },
};