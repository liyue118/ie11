import { EventDocumentDelete } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventDocumentDelete',

  state: {
    eventDocumentDelete: [],
  },

  effects: {
    *getEventDocumentDelete({ payload }, { call, put }) {
      const response = yield call(EventDocumentDelete, payload);
      yield put({
       type: 'changeEventDocumentDelete',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventDocumentDelete(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventDocumentDelete: payload,
      };
    },
  },
};