import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import message from '../../assets/信息.svg';
import head from '../../assets/head.png';
// import searchIcon from '../../assets/search.svg';
// import customerService from '../../assets/customerService.svg';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getNoticeData() {
    const { notices } = this.props;
    if (notices == null || notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onLocaleProviderMenuClick,
      onNoticeClear,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item>
          个人中心
        </Menu.Item>
        <Menu.Item key="logout">
          退出登录
        </Menu.Item>
      </Menu>
    );
    const localeProviderMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onLocaleProviderMenuClick}>
        <Menu.Item key="en">
          English
        </Menu.Item>
        <Menu.Item key="zh-cn">
          中文
        </Menu.Item>
      </Menu>
    )
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <div className={styles.header_logo}>
          <img src={logo} alt="logo" width="140" />
        </div>
        {isMobile && [
          <Link to="/user/login" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        {/* <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        /> */}
        <div className={styles.right}>
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <Tooltip title="">
            <a
              target="_blank"
              //href=""
              rel="noopener noreferrer"
              className={`${styles.action} ${styles.hoverColor}`}
            >
              <Icon type="customer-service" />
            </a>
          </Tooltip>
          <Tooltip title="">
            <a
              target="_blank"
              //href=""
              rel="noopener noreferrer"
              className={`${styles.action} ${styles.hoverColor}`}
            >
              <Icon type="message" />
              {/* <img width={16} src={`${message}`}/> */}
            </a>
          </Tooltip>
          {/* <Tooltip title="">
            <a
              target="_blank"
              //href=""
              rel="noopener noreferrer"
              className={`${styles.action} ${styles.hoverColor}`}
            >
              <i>English</i>
            </a>
          </Tooltip> */}
            <Dropdown overlay={localeProviderMenu}>
              {/* <span className={`${styles.action} ${styles.account}`}> */}
              <span className={`${styles.action} ${styles.hoverColor}`}>
                <span className={styles.localeProvider}>English</span>
              </span>
            </Dropdown>
          {/* {currentUser.name ? ( */}
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <div style={{width:"33px",textAlign:"center",backgroundImage:"url("+`${head}`+")",backgroundRepeat:"no-repeat",backgroundSize:"33px",backgroundPosition:"0px 17px"}}>
                 <Avatar size="small" icon="user" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                </div>
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          {/* ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )} */}
        </div>
      </div>
    );
  }
}
