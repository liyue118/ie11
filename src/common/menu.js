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
