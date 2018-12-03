import { ContactGroupList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'contactGroupList',

  state: {
    contactGroupList: [],
  },

  effects: {
    *getContactGroupList({ payload }, { call, put }) {
      const response = yield call(ContactGroupList, payload);
      yield put({
       type: 'changeContactGroupList',
        payload: response,
      });
    },
  },

  reducers: {
    changeContactGroupList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        contactGroupList: payload,
      };
    },
  },
};