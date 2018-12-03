import { 
    getPersonContactList, 
    getPersonInfo, 
    getCategoryType, 
    AccountInfoUpdate, 
    PersonContactSave, 
    PersonContactDelete,
    getAddressDropDownList,
    uploadAvatar,
    getAvataGettings,
    companyStubHubGetting,
    industryDropdownList,
    saveStubHub,
    userStubHubGetting,
} from "../services/personalInfos";
import { parse } from 'qs';
import { message } from 'antd';
import { join } from "path";
export default {
    namespace: 'personalInfos',
    state: {
        imgLoading:false,
        disabled:true,
        ticketsDisabled: true,
        contactList: [], //初始化联系人
        visible:false,
        currentUser:{},
        industryArr:[],
        promptObj: {
            visible: false,
            description: '',
            title: '',
            promptFor: 'default',
            okText: '确定',
            type: '',
            todo: '',
        },
        emailId:null,
        cascaderOptions:[],
        industryOptions:[],
        autoCompleteData:[],
        avatarImg:"",
        ticketsInfos:{},
    },
    reducers: {
        saveTicketsInfos(state, action) {
            return { ...state, ...action.payload };
        },
        changeOption(state, action) {
            return { ...state, ...action.payload };
        },
        changeAvatarImg(state, action) {
            return { ...state, ...action.payload };
        },
        changeOption(state, action) {
            return { ...state, ...action.payload };
        },
        changeAutoCompleteData(state, action) {
            return { ...state, ...action.payload };
        },
        saveEmailId(state, action) {
            return { ...state, ...action.payload };
        },
        changeVisible(state, action) {
            return { ...state, ...action.payload };
        },
        changeImgLoading(state, action) {
            return { ...state, ...action.payload };
        },
        changeDisabled(state, action) {
            return { ...state, ...action.payload };
        },
        saveContactList(state, action) {
            return { ...state, ...action.payload };
        },
        saveCurrentUser(state, action) {
            return { ...state, ...action.payload };
        },
        saveIndustryArr(state, action) {
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
        *getPersonContactList({ payload }, { call, put }) {
            const response = yield call(getPersonContactList, parse(payload));
            const arr=[];
            console.log('联系人列表',response)
            // if (!!response && !!response.length){
                response.map((item, index)=>{
                    item['key'] = item.Email
                    arr.push(item)
                })
                yield put({
                    type: "saveContactList",
                    payload: {
                        contactList: arr
                    }
                })
            // }
        },
        *getPersonInfo({ payload }, { call, put }) {
            const response = yield call(getPersonInfo, parse(payload));
            console.log('当前用户信息', response)
            if (!!response && !!response.Email){
                yield put({
                    type:"saveCurrentUser",
                    payload:{
                        currentUser: response
                    }
                })
            }
        },
        *userStubHubGetting({ payload }, { call, put }) {
            const response = yield call(userStubHubGetting, parse(payload));
            console.log('当前用户票务', response)
            if (!!response){
                if (!!response.InvoiceSendAddress){
                    let arr = response.InvoiceSendAddress.split('/');
                    response.RecipientContact=arr[0];
                    response.RecipientContactPhone=arr[1];
                    response.RecipientAddress=arr[2];
                }
                yield put({
                    type: "saveTicketsInfos",
                    payload: {
                        ticketsInfos: response
                    }
                })
            }
        },
        *AccountInfoUpdate({ payload }, { call, put }) {
            console.log('payload', payload)
            const response = yield call(AccountInfoUpdate, parse(payload));
            console.log('修改个人信息', response)
            if (!!response && response.ReturnCode===1001){
                // yield put({
                //     type: 'switchPrompt',
                //     payload: {
                //         visible: true,
                //         description: "修改成功！",
                //         title: '提示',
                //         todo: 'closeModal',
                //         type: 'success',
                //     },
                // });
                message.success("Modify Success！");
                yield put({
                    type:"changeDisabled",
                    payload:{
                        disabled:true
                    }
                })
            }
        },
        *getCategoryType({ payload }, { call, put }) {
            const response = yield call(getCategoryType, parse(payload));
            if (!!response && response.length){
                yield put({
                    type:"saveIndustryArr",
                    payload:{
                        industryArr: response
                    }
                })
            }
        },
        *companyStubHubGetting({ payload }, { call, put }) {
            const response = yield call(companyStubHubGetting, parse(payload));
            console.log('companyStubHubGetting', response);
            const arr=[];
            if (!!response && response.length){
                response.map((item,index)=>{
                    arr.push(item.BizRegistraionName)
                    // arr.key = item.ClientId;
                })
                yield put({
                    type:"changeAutoCompleteData",
                    payload:{
                        autoCompleteData: arr
                    }
                })
                if (response.length === 1){
                    // ticketsInfos
                    yield put({
                        type:"saveTicketsInfos",
                        payload:{
                            ticketsInfos: response[0]
                        }
                    })
                }else{
                    yield put({
                        type: "saveTicketsInfos",
                        payload: {
                            ticketsInfos: []
                        }
                    })
                }
            }else{
                yield put({
                    type: "saveTicketsInfos",
                    payload: {
                        ticketsInfos: {}
                    }
                })
            }
        },
        *saveStubHub({ payload }, { call, put }) {
            const response = yield call(saveStubHub, parse(payload));
            console.log('saveStubHub', response);
            if (!!response && response.ReturnCode===1001){
                message.success("保存票务信息成功！");
                yield put({
                    type:"changeDisabled",
                    payload:{
                        ticketsDisabled:true
                    }
                })
            }
        },
        *uploadAvatar({ payload }, { call, put }) {
            const response = yield call(uploadAvatar, parse(payload));
            if (!!response && response.ReturnCode === 1001){
                message.success('设置头像成功！')
                yield put({
                    type: "changeAvatarImg",
                    payload: {
                        avatarImg: payload.Avara
                    }
                })
            }
        },
        *getAvataGettings({ payload }, { call, put,select }) {
            const response = yield call(getAvataGettings, parse(payload));
            // console.log('获取头像', response);
            if (!!response){
                yield put({
                    type:"changeAvatarImg",
                    payload:{
                        avatarImg: response
                    }
                })
            }
        },
        *PersonContactDelete({ payload }, { call, put }) {
            const response = yield call(PersonContactDelete, parse(payload));
            if (!!response && response.ReturnCode === 1001 && response.Message ==="Successfully Delete Contactor"){
                yield put({
                    type: "getPersonContactList",
                    payload: {}
                })
                message.success(response.Message)
            }
        },
        *PersonContactSave({ payload }, { call, put }) {
            const response = yield call(PersonContactSave, parse(payload));
            if (!!response && response.ReturnCode===1001){
                yield put({
                    type:"getPersonContactList",
                    payload:{}
                })
                yield put({
                    type:"changeVisible",
                    payload:{
                        visible:false
                    }
                })
            } else if (!!response && response.ReturnCode === 1000){
                yield put({
                    type: 'switchPrompt',
                    payload: {
                        visible: true,
                        description: response.Message,
                        title: '提示',
                        todo: 'closeModal',
                        type: 'error',
                    },
                });
            }
        },
        *renderCascader({ payload }, { call, put }) {
            const response = yield call(getAddressDropDownList, parse(payload));
            console.log("城市级联菜单", response);
            if (!!response && !!response.ProvinceList && !!response.ProvinceList.length){
                const provinceList = response.ProvinceList;
                let values=[];
                provinceList.map((item,index)=>{
                    if (!!item.CityList && !!item.CityList.length){
                        let children = [];
                        item.CityList.map((i, j) => {
                            // children.push({
                            //     "value": i.CityName,
                            //     "label": i.CityName,
                            // })
                            let arr = [];
                            if (!!i.DistrictName && !!i.DistrictName.length){
                                i.DistrictName.map((k, l)=>{
                                    arr.push({
                                        "value": k,
                                        "label": k,
                                    })
                                })
                            }
                            children.push({
                                "value": i.CityName,
                                "label": i.CityName,
                                'children': arr
                            });
                        })
                        values.push({
                            "value": item.ProvinceName,
                            "label": item.ProvinceName,
                            'children': children
                        });
                    }
                });
                // console.log('values', values)
                yield put({
                    type:"changeOption",
                    payload:{
                        cascaderOptions: values
                    }
                })
            }
        },
        *industryDropdownList({ payload }, { call, put }) {
            const response = yield call(industryDropdownList, parse(payload));
            if (!!response && !!response.length){
                // console.log('industryDropdownList', response)
                let values=[];
                let children=[];
                response.map((item,index)=>{
                    if (!!item.Children && item.Children.length){
                        let children=[];
                        item.Children.map((i,j)=>{
                            children.push({
                                "value": i.Value,
                                "label": i.Label,
                            })
                        })
                        values.push({
                            "value": item.Value,
                            "label": item.Label,
                            'children' : children
                        });
                    }else{
                        values.push({
                            "value": item.Value,
                            "label": item.Label,
                        });
                    }
                })
                yield put({
                    type:"changeOption",
                    payload:{
                        industryOptions: values
                    }
                })
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/userInterface/personalInfos') {
                    dispatch({
                        type: "getPersonContactList",
                        payload: {}
                    })
                    dispatch({
                        type: "getPersonInfo",
                        payload: {}
                    })
                    dispatch({
                        type: "getCategoryType",
                        payload: {}
                    })
                    dispatch({
                        type: "getAvataGettings",
                        payload: {}
                    })
                    dispatch({
                        type: "userStubHubGetting",
                        payload: {}
                    })
                    dispatch({
                        type: "renderCascader",
                        payload: {
                            Country:"中国"
                        }
                    })
                    dispatch({
                        type: "industryDropdownList",
                        payload: {}
                    })
                };
            });
        },
    }
}
