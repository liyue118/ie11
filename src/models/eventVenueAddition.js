import { EventVenueAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventVenueAddition',

  state: {
    eventVenueAddition: [],
  },

  effects: {
    *getEventVenueAddition({ payload }, { call, put }) {
      const response = yield call(EventVenueAddition, payload);
      yield put({
       type: 'changeEventVenueAddition',
        payload: response,
      });
      if(response.ReturnCode == "1001"){
          message.success('选择场地成功~')
      }
      else{
        message.warn('选择场地失败~')
      }
    },
  },

  reducers: {
    changeEventVenueAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventVenueAddition: payload,
      };
    },
    }
}
 