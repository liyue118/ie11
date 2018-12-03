import { EventAgendaDetail } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventAgendaDetail',

  state: {
    eventAgendaDetail: [],
  },

  effects: {
    *getEventAgendaDetail({ payload }, { call, put }) {
      const response = yield call(EventAgendaDetail, payload);
      yield put({
       type: 'changeEventAgendaDetail',
        payload: response,
      });
      
    },
  },

  reducers: {
    changeEventAgendaDetail(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaDetail: payload,
      };
    },
  },
};