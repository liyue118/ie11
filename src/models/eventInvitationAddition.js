import { EventInvitationAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventInvitationAddition',

  state: {
    eventInvitationAddition: [],
  },

  effects: {
    *getEventInvitationAddition({ payload }, { call, put }) {
      const response = yield call(EventInvitationAddition, payload);
      yield put({
       type: 'changeEventInvitationAddition',
        payload: response,
      });
      if(response.ReturnCode == "1001"){
          message.success('保存邮件成功~')
      }
    },
  },

  reducers: {
    changeEventInvitationAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventInvitationAddition: payload,
      };
    },
  },
};