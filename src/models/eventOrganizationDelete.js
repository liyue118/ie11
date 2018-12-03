import { EventOrganizationDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventOrganizationDelete',

  state: {
    eventOrganizationDelete: [],
  },

  effects: {
    *getEventOrganizationDelete({ payload }, { call, put }) {
      const response = yield call(EventOrganizationDelete, payload);
      yield put({
       type: 'changeEventOrganizationDelete',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventOrganizationDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventOrganizationDelete: payload,
      };
    },
  },
};