import { isUrl } from '../utils/utils';

const menuData = [
    {
    name:'SET UP',
    icon:'dashboard',
    path:'createEvent/setUp',
    children:[{
        name:'General Settings',
        path:'general'
    },{
        name:'Content Settings',
        path:'content/step-form'
    },{
        name:'Registration Form',
        path:'registration'
    },{
        name:'Tickets & Coupons',
        path:'tickets',
    },{
        name:'Content Layout',
        path:'layout'
    }]
  },{
      name:'Promote',
      icon:'dashboard',
      path:'createEvent/promote',
      children:[
    //       {
    //       name:'Invitation',
    //       path:'invitation'
    //   },
      {
        name:'EmailMarketing',
        path:'emailMarketing'
    }]
  },{
      name:'Manage',
      icon:'dashboard',
      path:'createEvent/manage',
      children:[{
          name:'Registration List',
          path:'registration'
      }
    //   ,{
    //     name:'Paymetns',
    //     path:'payments'
    // }
    ,{
        name:'Invoice',
        path:'invoice'
    }
    ]
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
    return data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      const result = {
        ...item,
        path,
        authority: item.authority || parentAuthority,
      };
      if (item.children) {
        result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
      }
      return result;
    });
  }
  
  export const getMenuData = () => formatter(menuData);