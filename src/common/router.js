import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/user': {
      component: dynamicWrapper(app, ['login'], () => import('../layouts/UserLayout')),
    },
    '/user/login':{
      component: dynamicWrapper(app, ['login','personLoginAuthCodeResult'], () => import('../routes/User/Login')),
    },
    '/user/chooseLogin':{
      component: dynamicWrapper(app, [], () => import('../routes/User/ChooseLogin')),
    },
    '/user/register':{
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/forgotPassword':{
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/ForgotPass')),
    },
    '/home':{
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    '/home/list':{
      component: dynamicWrapper(app, ['homelist'], () => import('../routes/Home/List')),
    },
    '/event':{
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    '/event/draft':{
      component: dynamicWrapper(app, ['event'], () => import('../routes/Event/Draft')),
    },
    '/event/upcoming':{
      component: dynamicWrapper(app, [], () => import('../routes/Event/Upcoming')),
    },
    '/event/current':{
      component: dynamicWrapper(app, [], () => import('../routes/Event/Current')),
    },
    '/event/past':{
      component: dynamicWrapper(app, [], () => import('../routes/Event/Past')),
    },
    '/event/create':{
      component: dynamicWrapper(app, [], () => import('../routes/Event/Create')),
    },
    '/crm':{
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    // '/crm/report':{
    //   component: dynamicWrapper(app, [], () => import('../routes/CRM/Report')),
    // },
    '/crm/company':{
      component: dynamicWrapper(app, [], () => import('../routes/CRM/Company')),
    },
    '/crm/contacts':{
      component: dynamicWrapper(app, ['contacts','common'], () => import('../routes/CRM/Contacts')),
    },
    '/finance':{
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    '/finance/information':{
      component: dynamicWrapper(app, ['event'], () => import('../routes/Finance/Information')),
    },
    '/finance/payment':{
      component: dynamicWrapper(app, [], () => import('../routes/Finance/Payment')),
    },
    '/userInterface':{
      component: dynamicWrapper(app, [], () => import('../layouts/UserInterfaceLayout')),
    },
    '/userInterface/userIndex':{
      component: dynamicWrapper(app, ['userIndex'], () => import('../routes/UserInterface/UserIndex')),
    },
    '/userInterface/userIndexPhone':{
      component: dynamicWrapper(app, ['userIndex'], () => import('../routes/UserInterfacePhone/UserIndex')),
    },
    '/userInterface/registerEvent': {
      component: dynamicWrapper(app, ['registerEvent'], () => import('../routes/UserInterface/RegisterEvent')),
    },
    '/userInterface/registerEventPhone': {
      component: dynamicWrapper(app, ['registerEvent'], () => import('../routes/UserInterfacePhone/RegisterEvent')),
    },
    '/userInterface/eventDetails': {
      component: dynamicWrapper(app, ['eventDetails'], () => import('../routes/UserInterface/EventDetails')),
    },
    '/userInterface/eventDetailsPhone': {
      component: dynamicWrapper(app, ['eventDetails'], () => import('../routes/UserInterfacePhone/EventDetails')),
    },
    '/userInterface/personalSetting': {
      component: dynamicWrapper(app, ['personalSetting'], () => import('../routes/UserInterface/PersonalSetting')),
    },
    '/userInterface/personalInfos': {
      component: dynamicWrapper(app, ['personalInfos'], () => import('../routes/UserInterface/PersonalInfos')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
