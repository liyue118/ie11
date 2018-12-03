import { queryNotices, LoginOut, onLanguageSetting, getPersonInfo, getLanguage} from '../services/api';
import { clearAccountSMe, getLocale} from '../utils/utils';
import { routerRedux } from 'dva/router';
import { stringify, parse } from 'qs';
import {setLocale,getCookie} from '../utils/utils'

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *logout(_, { call, put }){
      const response = yield call(LoginOut);
      yield put({
        type: 'changeLoginOutStatus',
        payload: response,
      });
      // if(response.IsLogout){
        clearAccountSMe();
        yield put(
          routerRedux.push({
            pathname: '/userInterface/userIndex',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
        window.location.reload();

      // }
    },
    *languagesetting({ payload }, { call, put }){
      const response = yield call(onLanguageSetting,payload);
      if(response){
        setLocale(payload.LanguageCode);
      }
    },
    *getLanguage({ payload }, { call, put }){
      const response = yield call(getLanguage,payload);
      // const langu = getLocale();
      // if(response){
      //   if (langu !== response){
      //     setLocale(response);
      //   }
      // }
    },
    *getPersonInfo({ payload, callback }, { call, put }) {
      const response = yield call(getPersonInfo, parse(payload));
      if (!!response) {
        callback(response)
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeLoginOutStatus(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      // return history.listen(({ pathname, search }) => {
      //   // if (typeof window.ga !== 'undefined') {
      //   //   window.ga('send', 'pageview', pathname + search);
      //   // }
      // });
      history.listen(location => {
        dispatch({
          type: "getLanguage",
          payload: {}
        })
      })
    },
  },
};
