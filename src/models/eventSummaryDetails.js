import { EventSummaryDetails } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'eventSummaryDetails',

  state: {
    eventSummaryDetails: [],
  },

  effects: {
    *getEventSummaryDetails({ payload }, { call, put }) {
      const response = yield call(EventSummaryDetails, payload);
      yield put({
       type: 'changeEventSummaryDetails',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventSummaryDetails(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSummaryDetails: payload,
      };
    },
  },
};