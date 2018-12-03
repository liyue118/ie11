import { DttEntitySearch } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
export default {
  namespace: 'dttEntitySearch',

  state: {
    dttEntitySearch: [],
  },

  effects: {
    *getDttEntitySearch({ payload }, { call, put }) {
      const response = yield call(DttEntitySearch, payload);
      yield put({
       type: 'changedDttEntitySearch',
        payload: response,
      });
      if(response.ReturnCode == '1000'){
          message.warn('组织已存在')
      }
      if(response.ReturnCode == '1001'){
        message.warn('添加组织成功')
      }
    },
  },

  reducers: {
    changeDttEntitySearch(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        dttEntitySearch: payload,
      };
    },
  },
};