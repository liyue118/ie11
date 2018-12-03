import { EventOrganizationList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventOrganizationList',

  state: {
    eventOrganizationList: [],
  },

  effects: {
    *getEventOrganizationList({ payload }, { call, put }) {
      const response = yield call(EventOrganizationList, payload);
      yield put({
       type: 'changeEventOrganizationList',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventOrganizationList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventOrganizationList: payload,
      };
    },
  },
};