import { EventAgendaDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'eventAgendaDelete',

  state: {
    eventAgendaDelete: [],
  },

  effects: {
    *getEventAgendaDelete({ payload }, { call, put }) {
      const response = yield call(EventAgendaDelete, payload);
      yield put({
       type: 'changeEventAgendaDelete',
        payload: response,
      });
      
    },
  },

  reducers: {
    changeEventAgendaDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaDelete: payload,
      };
    },
  },
};