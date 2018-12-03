import { EventInvitationDetail } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventInvitationDetail',

  state: {
    eventInvitationDetail: [],
  },

  effects: {
    *getEventInvitationDetail({ payload }, { call, put }) {
      const response = yield call(EventInvitationDetail, payload);
      yield put({
       type: 'changeEventInvitationDetail',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventInvitationDetail(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventInvitationDetail: payload,
      };
    },
  },
};