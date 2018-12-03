import { EventDocumentList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventDocumentList',

  state: {
    eventDocumentList: [],
  },

  effects: {
    *getEventDocumentList({ payload }, { call, put }) {
      const response = yield call(EventDocumentList, payload);
      yield put({
       type: 'changeEventDocumentList',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventDocumentList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventDocumentList: payload,
      };
    },
  },
};