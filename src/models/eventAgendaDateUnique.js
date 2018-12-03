import { EventAgendaDateUnique } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'eventAgendaDateUnique',

  state: {
    eventAgendaDateUnique: [],
  },

  effects: {
    *getEventAgendaDateUnique({ payload }, { call, put }) {
      const response = yield call(EventAgendaDateUnique, payload);
      yield put({
       type: 'changeEventAgendaDateUnique',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventAgendaDateUnique(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaDateUnique: payload,
      };
    },
  },
};