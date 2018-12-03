import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'user',
    path: 'user',
    hideInMenu: true,
    children: [{
      name: 'login',
      //authority: 'admin',
      path: 'login',
    }],
  },
  {
    name: 'Home',
    icon: 'icon-cc-home',
    path: 'home/list',
    // children: [{
    //     name: 'dashboard',
    //     path: 'list'
    //   }
    // ],
  },
  {
    name: 'Events',
    icon:'icon-rili',
    path: 'event',
    children: [{
      name: 'Draft',
      path: 'draft'
    },{
      name:'Upcoming',
      path:'upcoming'
    },{
      name:'InProgress',
      path:'current'
    },{
      name:'Past',
      path:'past'
    }],
  },{
    name:'CRM',
    icon:'icon-lianxiren',
    path:'crm',
    children: [{
      name: 'Companies',
      path: 'company',
    },{
      name: 'Contacts',
      path: 'contacts',
    }],
  },{
    name:'Finance',
    icon:'icon-caiwu',
    path:'finance',
    children:[{
      name:'Invoice',
      path:'information'
    },{
      name:'Payment',
      path:'payment'
    }]
  },
  // {
  //   name: 'userInterface',
  //   path: 'userInterface',
  //   icon:'icon-lianxiren',
  //   children: [{
  //     name: 'dashboard',
  //     path: 'userIndex',
  //   }, {
  //       name: 'dashboard',
  //       path: 'userIndexPhone',
  //     }],
  // },
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
