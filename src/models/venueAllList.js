import { VenueAllList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'venueAllList',

  state: {
    venueAllList: [],
  },

  effects: {
    *getVenueAllList({ payload }, { call, put }) {
      const response = yield call(VenueAllList, payload);
      yield put({
       type: 'changeVenueAllList',
        payload: response,
      });
    },
  },

  reducers: {
    changeVenueAllList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        venueAllList: payload,
      };
    },
  },
};