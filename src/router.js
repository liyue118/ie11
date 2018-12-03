import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';
import { getEventData } from './common/eventRouter';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const getEventRouterData = getEventData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/event'].component;
  const UserInterfaceLayout = routerData['/userInterface'].component;
  const EventLayout = getEventRouterData['/createEvent'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
        <Route
              path="/user"
              component={UserLayout}
            />
            <Route
              path="/userInterface"
              component={UserInterfaceLayout}
            />
            <Route
              path="/home"
              render={props => <BasicLayout {...props} />}
              redirectPath={getQueryPath('/home/list', {
                redirect: window.location.href,
              })}
            />
            <Route
              path="/finance"
              render={props => <BasicLayout {...props} />}
              redirectPath={getQueryPath('/finance/payments', {
                redirect: window.location.href,
              })}
            />
            <Route
              path="/event"
              render={props => <BasicLayout {...props} />}
              redirectPath={getQueryPath('/event/new', {
                redirect: window.location.href,
              })}
            />
            <Route
              path="/createEvent"
              render={props => <EventLayout {...props} />}
              redirectPath={getQueryPath('/createEvent/setUp/general', {
                redirect: window.location.href,
              })}
            />
            <Route
              path="/crm"
              render={props => <BasicLayout {...props} />}
              redirectPath={getQueryPath('/crm/report', {
                redirect: window.location.href,
              })}
            />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
