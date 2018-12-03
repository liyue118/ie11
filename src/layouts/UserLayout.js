import React from 'react';
import { 
  //Link,
   Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
//import { Icon } from 'antd';
import styles from './UserLayout.less';
import { getRoutes } from '../utils/utils';


class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Deloitte`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
        {/* <GlobalHeader/> */}
          <div className={styles.content}>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          {/* <GlobalFooter/> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
