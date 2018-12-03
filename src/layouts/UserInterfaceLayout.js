import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message ,Row , Col} from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
// import UserInterfaceHeader from '../components/UserInterfaceHeader';
import GlobalHeader from 'components/GlobalHeader';
import SiderMenu from 'components/EventSiderMenu';
import { getRoutes, getLocale, getCookie} from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/eventMenu';
import logo from '../assets/DeloitteWhiteDefault.png';
import styles from './UserInterfaceLayout.less';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */

const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});
class UserInterfaceLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
    LocaleProvider:"English",
    isAdmin:false,
    name: "",
  };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    const sk = getCookie("sk") != null ? getCookie("sk") : '';
    if(!!sk){
      dispatch({
        type: "global/getPersonInfo",
        payload: {},
        callback:data=>{
          if(!!data&&!!data.RoleType){
            if (data.RoleType===1001){
              this.setState({ isAdmin:false})
            }else{
              this.setState({ isAdmin: true })
            }
            if(!!data){
              this.setState({
                name: data.FirstName + data.LastName
              })
            }
          }
        }
      })
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Deloitte';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - Deloitte`;
    }
    return title;
  }

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch(routerRedux.push('/user/login'));
    }
  };
  handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      // this.props.dispatch(routerRedux.push('/user/login'));
      this.props.dispatch({
          type:'global/logout',
          payload:{}
      })
    } else if (key ==="setting"){
      this.props.dispatch(routerRedux.push('/userInterface/personalSetting'));
    } else if (key === "personInfo") {
      this.props.dispatch(routerRedux.push('/userInterface/personalInfos'));
    } else if (key === 'logIn'){
      this.props.dispatch(routerRedux.push('/user/login'));
    }
  };

  LanguageSetting =()=>{
    let locale =getLocale();
    const { dispatch } = this.props;
    locale=(locale=='zh-CN')?'en-US':'zh-CN';
    dispatch({
      type:'global/languagesetting',
      payload:{'LanguageCode':locale}
    })
  }

  handleLocaleProviderMenuClick = ({ key }) => {
    console.log('key',key)
  }

  handleLogin = () =>{
    this.props.dispatch(routerRedux.push('/user/login'));
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props;
    const { isMobile: mb, isAdmin, name} = this.state;
    const bashRedirect = this.getBaseRedirect();
    const layout = (
      <Layout className="layout userIndexfaceLayout">
          <Header style={{ padding: 0 }}>
          <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              handleLogin={this.handleLogin}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onUserMenuClick={this.handleUserMenuClick}
              onLanguageSetting={this.LanguageSetting}
              onLocaleProviderMenuClick={this.handleLocaleProviderMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              hasSider={false}
              isAdminUser={false}
              isAdmin={isAdmin}
              linkToUserIndex={true}
              name={name}
            />
          </Header>
          <Content style={{ height: '100%' }}>
            <Switch>
                {redirectData.map(item => (
                            <Redirect key={item.from} exact from={item.from} to={item.to} />
                        ))}
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
                      <Redirect exact from="/home" to={bashRedirect} />
            </Switch>
          </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer> */}
      </Layout>
    );

    return (
      <div>
        {/* <Row type="flex" justify="center">
          <Col span={18}> */}
            <DocumentTitle title={this.getPageTitle()}>
              <ContainerQuery query={query}>
                {params => <div className={classNames(params)}>{layout}</div>}
              </ContainerQuery>
            </DocumentTitle>
          {/* </Col>
        </Row> */}
      </div>
    );
  }
}

export default connect(({ user, global = {}, loading }) => ({
  //currentUser: user.currentUser,
  collapsed: global.collapsed,
  //fetchingNotices: loading.effects['global/fetchNotices'],
  //notices: global.notices,
}))(UserInterfaceLayout);
//
