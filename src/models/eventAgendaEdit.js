import { EventAgendaEdit } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventAgendaEdit',

  state: {
    eventAgendaEdit: [],
  },

  effects: {
    *getEventAgendaEdit({ payload }, { call, put }) {
      const response = yield call(EventAgendaEdit, payload);
      yield put({
       type: 'changeEventAgendaEdit',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventAgendaEdit(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaEdit: payload,
      };
    },
  },
};