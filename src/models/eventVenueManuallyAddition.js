import { EventVenueManuallyAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventVenueManuallyAddition',

  state: {
    eventVenueManuallyAddition: [],
  },

  effects: {
    *getEventVenueManuallyAddition({ payload }, { call, put }) {
      const response = yield call(EventVenueManuallyAddition, payload);
      yield put({
       type: 'changeEventVenueManuallyAddition',
        payload: response,
      });
      if(response.ReturnCode == '1001'){
        message.success('创建成功!')
      }
      if(response.ReturnCode == '1000'){
        message.warning('创建未成功~')
      }
    },
  },

  reducers: {
    changeEventVenueManuallyAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventVenueManuallyAddition: payload,
      };
    },
  },
};