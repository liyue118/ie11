import { SpeakerDetail } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'speakerDetail',

  state: {
    speakerDetail: [],
  },

  effects: {
    *getSpeakerDetail({ payload }, { call, put }) {
      const response = yield call(SpeakerDetail, payload);
      yield put({
       type: 'changeSpeakerDetail',
        payload: response,
      });
      if (response == [] || response.length<1) {}else{
          
      }
    },
  },

  reducers: {
    changeSpeakerDetail(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        speakerDetail: payload,
      };
    },
  },
};