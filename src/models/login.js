import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {message} from 'antd';
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // console.log('response', response)
      // response.RoleType={
      //   Normal = 1001, // 普通用户
      //   Admin = 1002, // 管理员
      //   SuperAdmin = 1003	// 超级管理员
      // }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      //Login successfully
      if (response.ReturnCode == '1001') {
          reloadAuthorized();
          var expriseDate=new Date();
          expriseDate.setTime(expriseDate.getTime() + 1000*24*60*60*1000);
          console.log(expriseDate);
          document.cookie="sk="+response.SessionKey+";Expires="+expriseDate.toUTCString();
          // Response.Cookies("sk").Expires=Date+100; 
          message.success('Log in successfully!')
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          if (!!response && response.RoleType === 1001){
            yield put(routerRedux.replace(redirect || '/userInterface/userIndex'));
          } else if (!!response && response.RoleType === 1002){
            yield put(routerRedux.replace(redirect || '/home/list'));
          }
        }
        if (response.ReturnCode == '1005') {
          message.warning('warning~')
        }
        if (response.ReturnCode == '1003') {
          message.error('密码不正确!')
        }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload,
      };
    },
  },
};
