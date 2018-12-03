import { EventDiscountList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventDiscountList',

  state: {
    eventDiscountList: [],
  },

  effects: {
    *getEventDiscountList({ payload }, { call, put }) {
      const response = yield call(EventDiscountList, payload);
      yield put({
       type: 'changeEventDiscountList',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventDiscountList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventDiscountList: payload,
      };
    },
  },
};