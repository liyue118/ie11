import { EventSponsorDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventSponsorDelete',

  state: {
    eventSponsorDelete: [],
  },

  effects: {
    *getEventSponsorDelete({ payload }, { call, put }) {
      const response = yield call(EventSponsorDelete, payload);
      yield put({
       type: 'changeEventSponsorDelete',
        payload: response,
      });
      
    },
  },

  reducers: {
    changeEventSponsorDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSponsorDelete: payload,
      };
    },
  },
};