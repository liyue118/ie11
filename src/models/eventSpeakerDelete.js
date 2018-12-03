import { EventSpeakerDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventSpeakerDelete',

  state: {
    eventSpeakerDelete: [],
  },

  effects: {
    *getEventSpeakerDelete({ payload }, { call, put }) {
      const response = yield call(EventSpeakerDelete, payload);
      yield put({
       type: 'changeEventSpeakerDelete',
        payload: response,
      });
      if (response.ReturnCode == '1001') {
        message.success('删除成功！')
      }else{
        message.warn('删除失败~')
      }
    },
  },

  reducers: {
    changeEventSpeakerDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSpeakerDelete: payload,
      };
    },
  },
};