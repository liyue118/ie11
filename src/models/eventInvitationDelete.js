import { EventInvitationDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventInvitationDelete',

  state: {
    eventInvitationDelete: [],
  },

  effects: {
    *getEventInvitationDelete({ payload }, { call, put }) {
      const response = yield call(EventInvitationDelete, payload);
      yield put({
       type: 'changeEventInvitationDelete',
        payload: response,
      });
      if(response.ReturnCode == "1001"){
          message.success("删除成功~");
      }else{
          message.warning(response.Message);
      }
    },
  },

  reducers: {
    changeEventInvitationDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventInvitationDelete: payload,
      };
    },
  },
};