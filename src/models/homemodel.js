import {query} from '../services/homelist'

export default {
    namespace: 'homemodel',
    state: {
    },
    reducers: {
      add(state, { payload: todo }) {
        // Save data to state
        return [...state, todo];
      },
    },
    effects: {
     *fetch({ payload }, { call, put }) { 
       console.log(payload);  
       const data = yield call(query, payload);
        // console.log(data);
       
      },
    },
    subscriptions: {
      setup({ history, dispatch }) {
        // Subscribe history(url) change, trigger `load` action if pathname is `/`
        return history.listen(({ pathname }) => {
          if (pathname === '/') {
            dispatch({ type: 'load' });
          }
        });
      },
    },
  }