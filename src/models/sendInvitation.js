import { SendInvitation } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'sendInvitation',

  state: {
    sendInvitation: [],
  },

  effects: {
    *getSendInvitation({ payload }, { call, put }) {
      const response = yield call(SendInvitation, payload);
      yield put({
       type: 'changeSendInvitation',
        payload: response,
      });
      if(response.ReturnCode == "1001"){
        message.success("Mail sent successfully");
      }else{
        message.warn("Send mail failed");
      }
    },
  },

  reducers: {
    changeSendInvitation(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        sendInvitation: payload,
      };
    },
  },
};