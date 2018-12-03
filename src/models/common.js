import {AddressDropDownList} from '../services/common';
import { stringify,parse } from 'qs';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
import moment from 'moment';
export default {
    namespace: 'common',
  
    state: {
        cascaderOptions:[],
    },
  
    effects: {
        *AddressDropDownList({ payload,callback}, { call, put }) {
            const response = yield call(AddressDropDownList, payload);
            if (!!response && !!response.ProvinceList && !!response.ProvinceList.length){
                const provinceList = response.ProvinceList;
                let values=[];
                provinceList.map((item,index)=>{
                    if (!!item.CityList && !!item.CityList.length){
                        let children = [];
                        item.CityList.map((i, j) => {
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
                callback(values);
            }
        },
    },
  
    reducers: {
        changeOption(state, {payload}) {
            console.log(payload);
            return {...state,cascaderOptions: payload };
        },
    },
    subscriptions: {
        setup({ history, dispatch }) {
          return history.listen(({ pathname }) => {
            
          });
        
        },
      },
  };