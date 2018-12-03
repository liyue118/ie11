import { ContactAllList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'contactAllList',

  state: {
    contactAllList: [],
  },

  effects: {
    *getContactAllList({ payload }, { call, put }) {
      const response = yield call(ContactAllList, payload);
      yield put({
       type: 'changeContactAllList',
        payload: response,
      });
    },
  },

  reducers: {
    changeContactAllList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        contactAllList: payload,
      };
    },
  },
};