import { 
    getEventDetails,
    domShowOrHidden,
    documentDownload,
} from "../services/eventDetails";
import { getPageQuery, blobDownload, setLocale, getLocale } from '../utils/utils';
import { parse } from 'qs';
import { EventInvitationDelete } from "../services/api";
const initState={
    currentEvent: {},
    mapVisible: false,
    speakerVisible: false,
    showOrHiddenObj: {},
    currentSpeaker: {},
    btnIndex: '',
    loadFile: false,
}
export default {
    namespace: 'eventDetails',
    state: initState,
    reducers: {
        initSetState(state, { payload }) {
            return {...state,...initState};
        },
        changeShowOrHiddenObj(state, action) {
            return { ...state, ...action.payload };
        },
        changeEvent(state, action) {
            return { ...state, ...action.payload };
        },
        changeLoadFile(state, action) {
            return { ...state, ...action.payload };
        },
        changeBtnDownload(state, action) {
            return { ...state, ...action.payload };
        },
        saveCurrentSpeaker(state, action) {
            return { ...state, ...action.payload };
        },
        changeMapVisible(state, action) {
            return { ...state, ...action.payload };
        },
        changeSpeakerVisible(state, action) {
            return { ...state, ...action.payload };
        },
        participantsNumChange(state, action) {
            return { ...state, ...action.payload };
        },
        renderTicketLimit(state, action) {
            return { ...state, ...action.payload };
        },
    },
    effects: {
        *getEventDetails({ payload }, {call, put }){
            const response = yield call(getEventDetails, parse(payload));
            console.log('会议详情',response);
            if(!!response){
                yield put({
                    type: "changeEvent",
                    payload: {
                        currentEvent: response
                    }
                });
                const aa=getLocale();
                console.log('aa',aa)
                if (!!response.language && response.language==="zh"&&aa==='zh-CN'){
                    return
                } else if (!!response.language && response.language === "en" && aa === 'en-US'){
                    return
                } else if (!!response.language && response.language === "zh" && aa === 'en-US') {
                    yield put({
                        type: 'global/languagesetting',
                        payload: { 'LanguageCode': 'zh-CN' }
                    })
                } else if (!!response.language && response.language === "en" && aa === 'zh-CN') {
                    yield put({
                        type: 'global/languagesetting',
                        payload: { 'LanguageCode': 'en-US' }
                    })
                }
            }
        },
        *domShowOrHidden({ payload }, {call, put }){
            console.log('显示隐藏payload', payload)
            const response = yield call(domShowOrHidden, parse(payload));
            console.log('显示隐藏', response);
            yield put({
                type: "changeShowOrHiddenObj",
                payload: {
                    showOrHiddenObj: response
                }
            })
        },
        *documentDownload({ payload }, { call, put, select}){
            const response = yield call(documentDownload, parse(payload));
            console.log('下载附件', response);
            if (response.FileContent) {
                //获取后台文件
                blobDownload(response);
                yield put({
                    type: "changeLoadFile",
                    payload: {
                        loadFile: false
                    }
                })
            } else {
                throw response
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/userInterface/eventDetails' || location.pathname === '/userInterface/eventDetailsPhone') {
                    // const data = localStorage.getItem("currentEvent");  //上级页面传入参数
                    dispatch({
                        type:"initSetState",
                    })
                    const eventId = getPageQuery(location.search).id;
                    if (!!eventId && eventId!=="") {
                        dispatch({
                            type:"domShowOrHidden",
                            payload:{
                                EventId: eventId
                            }
                        })
                        dispatch({
                            type: "getEventDetails",
                            payload: {
                                EventId: eventId
                            }
                        })
                    }
                };
            });
        },
    }
}
