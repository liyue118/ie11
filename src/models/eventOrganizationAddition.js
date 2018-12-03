import { EventOrganizationAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventOrganizationAddition',

  state: {
    eventOrganizationAddition: [],
  },

  effects: {
    *getEventOrganizationAddition({ payload }, { call, put }) {
      const response = yield call(EventOrganizationAddition, payload);
      yield put({
       type: 'changeEventOrganizationAddition',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventOrganizationAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventOrganizationAddition: payload,
      };
    },
  },
};