import { getPersonInfo, passwordReset } from "../services/personalSetting";
import { parse } from 'qs';
import { message } from 'antd';
export default {
    namespace: 'personalSetting',
    state: {
        currentUserInfo: {}, 
        promptObj: {
            visible: false,
            description: '',
            title: '',
            promptFor: 'default',
            okText: '确定',
            type: '',
            todo: '',
        },
    },
    reducers: {
        changeVisible(state, action) {
            return { ...state, ...action.payload };
        },
        saveCurrentUserInfo(state, action) {
            return { ...state, ...action.payload };
        },
        switchPrompt(state, action) {
            return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
        },
        closePrompt(state) {
            return { ...state, promptObj: Object.assign({}, state.promptObj, { visible: false }) };
        },
    },
    effects: {
        *getPersonInfo({ payload }, { call, put }) {
            const response = yield call(getPersonInfo, parse(payload));
            if (!!response && !!response.Email){
                yield put({
                    type: "saveCurrentUserInfo",
                    payload: {
                        currentUserInfo: response
                    }
                })
            }else{
                message.error('数据请求失败，无法获取当前用户Email');
            }

        },
        *passwordReset({ payload,callback }, { call, put }) {
            const response = yield call(passwordReset, parse(payload));
            if (response.ReturnCode === 1001 && response.Message === "Successfully Reset"){
                message.success('Successfully Reset!');
                callback("退出登录")
            } else if (response.ReturnCode === 1003 && response.Message === "Error Password"){
                message.error('Error Password!');
                callback("");
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/userInterface/personalSetting') {
                    dispatch({
                        type: "getPersonInfo",
                        payload: {}
                    })
                };
            });
        },
    }
}
