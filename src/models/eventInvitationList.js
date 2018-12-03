import { EventInvitationList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventInvitationList',

  state: {
    eventInvitationList: [],
  },

  effects: {
    *getEventInvitationList({ payload }, { call, put }) {
      const response = yield call(EventInvitationList, payload);
      yield put({
       type: 'changeEventInvitationList',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventInvitationList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventInvitationList: payload,
      };
    },
  },
};