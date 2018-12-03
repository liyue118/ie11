import { EventSponsorManuallyAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventSponsorManuallyAddition',

  state: {
    eventSponsorManuallyAddition: [],
  },

  effects: {
    *getEventSponsorManuallyAddition({ payload }, { call, put }) {
      const response = yield call(EventSponsorManuallyAddition, payload);
      yield put({
       type: 'changeEventSponsorManuallyAddition',
        payload: response,
      });
      if(response.ReturnCode == '1001'){
        message.success('创建成功!')
      }
      if(response.ReturnCode == '1000'){
        message.warning('创建未成功!用户名或网址已存在~')
      }
    },
  },

  reducers: {
    changeEventSponsorManuallyAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSponsorManuallyAddition: payload,
      };
    },
  },
};