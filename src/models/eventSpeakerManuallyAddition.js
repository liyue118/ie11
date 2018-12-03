import { EventSpeakerManuallyAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventSpeakerManuallyAddition',

  state: {
    eventSpeakerManuallyAddition: [],
  },

  effects: {
    *getEventSpeakerManuallyAddition({ payload }, { call, put }) {
      const response = yield call(EventSpeakerManuallyAddition, payload);
      yield put({
       type: 'changeEventSpeakerManuallyAddition',
        payload: response,
      });
      if(response.ReturnCode == '1001'){
        message.success('创建成功!')
      }
      if(response.ReturnCode == '1000'){
        message.warning('创建未成功!用户名或邮箱已存在~')
      }
    },
  },

  reducers: {
    changeEventSpeakerManuallyAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSpeakerManuallyAddition: payload,
      };
    },
  },
};