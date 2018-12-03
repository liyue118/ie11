import { EventInvitationEdit } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventInvitationEdit',

  state: {
    eventInvitationEdit: [],
  },

  effects: {
    *getEventInvitationEdit({ payload }, { call, put }) {
      const response = yield call(EventInvitationEdit, payload);
      yield put({
       type: 'changeEventInvitationEdit',
        payload: response,
      });
      if(response.ReturnCode == "1001"){
        message.success('修改邮件成功~')
    }
    },
  },

  reducers: {
    changeEventInvitationEdit(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventInvitationEdit: payload,
      };
    },
  },
};