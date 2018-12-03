import { SpeakerSearch } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'speakerSearch',

  state: {
    speakerSearch: [],
  },

  effects: {
    *getSpeakerSearch({ payload }, { call, put }) {
      const response = yield call(SpeakerSearch, payload);
      yield put({
       type: 'changeSpeakerSearch',
        payload: response,
      });
      if (response.ReturnCode == '1001') {
        
      }
    },
  },

  reducers: {
    changeSpeakerSearch(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        speakerSearch: payload,
      };
    },
  },
};