import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import SiderMenu from '../components/SiderMenu';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import {injectIntl,formatMessage} from 'react-intl';
import {getLocale,getCookie} from '../utils/utils'
import { getMenuData } from '../common/menu';
import logo from '../assets/DeloitteWhiteDefault.png';


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

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
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
    if (!!sk) {
      dispatch({
        type: "global/getPersonInfo",
        payload: {},
        callback: data => {
          if (!!data && !!data.RoleType) {
            if (!!data) {
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
    const {intl}=this.props;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      // title = `${currRouterData.name} - Deloitte`;
      title=intl.formatMessage({id:currRouterData.name})+' - Deloitte';
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
    const {dispatch}=this.props;
    if (key === 'logout') {
      dispatch({
        type: 'global/logout',
      });
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
  handleLogin = () => {
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
    const { isMobile: mb ,name} = this.state;
    const bashRedirect = this.getBaseRedirect();
    const cWidth=mb?window.innerWidth:(collapsed?window.innerWidth-80:window.innerWidth-200);
    const layout = (
      <Layout>
        <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              location={location}
              handleLogin={this.handleLogin}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onLanguageSetting={this.LanguageSetting}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              hasSider={true}
              isAdminUser={true} 
              name={name} 
            />
          </Header>
        <Layout style={{background:'#0c1319',minHeight:window.innerHeight-64}}>
            <SiderMenu
            logo={logo}
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={getMenuData()}
            collapsed={collapsed}
            location={location}
            isMobile={mb}
            onCollapse={this.handleMenuCollapse}
          />
          <Content style={{minHeight:'100%',background:'#fff',borderRadius:'18px 18px 0 0',width:cWidth}}>
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
              {/*
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}}*/}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global = {}, loading }) => ({
  //currentUser: user.currentUser,
  collapsed: global.collapsed
  //fetchingNotices: loading.effects['global/fetchNotices'],
  //notices: global.notices,
}))(injectIntl(BasicLayout));
