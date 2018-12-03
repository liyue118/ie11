import {Efeventlist,
  EventNumStatistic,
  EventIndustryStatistic,
  EventCityStatistic} from '../services/home';

export default {
    namespace: 'homelist',
    state: {
      eventlistDate:[],
      pageSize:10,  //add by jc
      page: {
        ItemsPerPage: 15,
        Page: 1,
        TotalPages: 1,
        TotalRecords: 0,
      }
    },
    reducers: {
      reducersEventlistDate(state, { payload }) {
        return {
          ...state,
          eventlistDate: payload,
          }
      },
      changePageSize(state, action) {
        return { ...state, ...action.payload };
      },
      savePage(state, action) {
        return { ...state, ...action.payload };
      },
    },
    effects: {
     *Efeventlist({ payload }, { call, put }) { 
       const response = yield call(Efeventlist,payload);
       console.log('response', response)
        // yield put({
        //   type:"reducersEventlistDate",
        //   payload:response!=null?response:[]
        // })
       if (!!response && !!response.Events) {
         let page = {
           ItemsPerPage: response.ItemsPerPage,
           Page: response.Page,
           TotalPages: response.TotalPages,
           TotalRecords: response.TotalRecords,
         }
         yield put({
           type: "reducersEventlistDate",
           payload: response != null && !!response.Events ? response.Events : []
         });
         yield put({
           type: "savePage",
           payload: {
             page: page
           }
         })
       }  
      },
      *EventNumStatistic({ payload,callback}, { call, put }) {
        const response = yield call(EventNumStatistic,payload);
        let listValue=[],DataList={};
        response.forEach(element => {
          if(element.Key=='Upcoming' || element.Key=='In Progress' || element.Key=='Past' || element.Key=='Draft'){
            listValue.push({
              item:element.Key,
              count:element.Value
            })
          }else{
            // DataList.push({
            //   item:element.Key,
            //   count:element.Value
            // })
            if(element.Key=='Total'){
              DataList['Total']=element.Value
            }else if(element.Key=='ThisWeekEvents'){
              DataList['ThisWeekEvents']=element.Value
            }
          }
        });

        let resData={
          NumCharts:listValue,
          EventNumData:DataList
        };
        callback(resData);
       },
      *EventIndustryStatistic({ payload,callback}, { call, put }) {
        const response = yield call(EventIndustryStatistic,payload);
        callback(response)
       },
      *EventCityStatistic({ payload,callback}, { call, put }) {
        const response = yield call(EventCityStatistic,payload);
        callback(response)
       }
    },
    subscriptions: {
      setup({ history, dispatch }) {
        return history.listen(({ pathname }) => {
          if (pathname === '/home/list') {
            // dispatch({
            //   type:'Efeventlist',
            //   payload: {
            //     'Filter': 1009003,
            //     'QueryClause': null,
            //     'OrderBy': '',
            //     'Page': 1,
            //     'ItemsPerPage': '15',
            //     'IsExport': false
            //   }              
            // })
          }
        });
      
      },
    },
  }