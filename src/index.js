import './polyfill';
import dva from 'dva';
import {IntlProvider, addLocaleData} from 'react-intl';
import createHistory from 'history/createHashHistory';
import ReactDOM from 'react-dom';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
//import './rollbar';
import {getLocale} from '../src/utils/utils'

import './index.less';
import zhCN from './local/zh-CN';
import enUS from '../src/local/en-US';
// addLocaleData({...enUS,...zhCN});
// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);
// 5. Star
const App = app.start();

var de_locale=getLocale();
de_locale=require('../src/local/'+de_locale+'.js').default;
ReactDOM.render(<IntlProvider locale="en" messages={de_locale} ><App /></IntlProvider>,document.getElementById('root'));

// ReactDOM.render(<IntlProvider locale="zh" messages={zhCN}><App /></IntlProvider>);
export default app._store; // eslint-disable-line
