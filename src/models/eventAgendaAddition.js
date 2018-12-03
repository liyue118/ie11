import { EventAgendaAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventAgendaAddition',

  state: {
    eventAgendaAddition: [],
  },

  effects: {
    *getEventAgendaAddition({ payload }, { call, put }) {
      const response = yield call(EventAgendaAddition, payload);
      yield put({
       type: 'changeEventAgendaAddition',
        payload: response,
      });
      if (response.ReturnCode == '1001') {
        message.success('创建成功！')
      }
    },
  },

  reducers: {
    changeEventAgendaAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventAgendaAddition: payload,
      };
    },
  },
};