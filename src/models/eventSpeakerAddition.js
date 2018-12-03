import { EventSpeakerAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventSpeakerAddition',

  state: {
    eventSpeakerAddition: [],
  },

  effects: {
    *getEventSpeakerAddition({ payload }, { call, put }) {
      const response = yield call(EventSpeakerAddition, payload);
      yield put({
       type: 'changeEventSpeakerAddition',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventSpeakerAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSpeakerAddition: payload,
      };
    },
  },
};