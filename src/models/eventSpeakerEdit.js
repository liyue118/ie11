import { EventSpeakerEdit } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventSpeakerEdit',

  state: {
    eventSpeakerEdit: [],
  },

  effects: {
    *getEventSpeakerEdit({ payload }, { call, put }) {
      const response = yield call(EventSpeakerEdit, payload);
      yield put({
       type: 'changEeventSpeakerEdit',
        payload: response,
      });
      if (response.ReturnCode == '1001') {
        message.success('修改成功！')
      }else{
        message.warn('修改失败~')
      }
    },
  },

  reducers: {
    changeEventSpeakerEdit(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSpeakerEdit: payload,
      };
    },
  },
};