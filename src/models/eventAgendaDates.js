import { EventAgendaDates } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'eventAgendaDates',

  state: {
    eventAgendaDates: [],
  },

  effects: {
    *getEventAgendaDates({ payload }, { call, put }) {
      const response = yield call(EventAgendaDates, payload);
      yield put({
       type: 'changeEventAgendaDates',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventAgendaDates(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaDates: payload,
      };
    },
  },
};