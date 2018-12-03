import { EventAgendaList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventAgendaList',

  state: {
    eventAgendaList: [],
  },

  effects: {
    *getEventAgendaList({ payload }, { call, put }) {
      const response = yield call(EventAgendaList, payload);
      yield put({
       type: 'changeEventAgendaList',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventAgendaList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaList: payload,
      };
    },
  },
};