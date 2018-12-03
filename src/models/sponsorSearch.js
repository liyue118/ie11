import { SponsorSearch } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'sponsorSearch',

  state: {
    sponsorSearch: [],
  },

  effects: {
    *getSponsorSearch({ payload }, { call, put }) {
      const response = yield call(SponsorSearch, payload);
      yield put({
       type: 'changeSponsorSearch',
        payload: response,
      });
    },
  },

  reducers: {
    changeSponsorSearch(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        sponsorSearch: payload,
      };
    },
  },
};