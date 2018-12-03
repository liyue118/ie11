import { EventAgendaDateDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'eventAgendaDateDelete',

  state: {
    eventAgendaDateDelete: [],
  },

  effects: {
    *getEventAgendaDateDelete({ payload }, { call, put }) {
      const response = yield call(EventAgendaDateDelete, payload);
      yield put({
       type: 'changeEventAgendaDateDelete',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventAgendaDateDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaDateDelete: payload,
      };
    },
  },
};