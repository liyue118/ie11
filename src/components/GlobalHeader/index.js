import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import { FormattedMessage,injectIntl,intlShape } from 'react-intl';
import styles from './index.less';
import { getCookie } from '../../utils/utils';
import iconfont from '../../assets/iconfont/iconfont.css'

 class GlobalHeader extends PureComponent {
  // constructor(props) {
  //   super(props);
    
  // }
  state = {
    sk: getCookie("sk") != null ? getCookie("sk") : ''
  }
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

  noChange = () =>{

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
      onUserMenuClick,
      handleLogin,
      onLanguageSetting,
      // onNoticeClear,
      isAdminUser,
      isAdmin,
      hasSider,
      name,
      intl,
      linkToUserIndex,  //bool 默认值为false 点击logo跳转到userIndex
    } = this.props;
    const { sk} = this.state;
    const menuLianxi = (
      <Menu className={styles.menu} style={{textAlign:'center'}} selectedKeys={[]}>
       <Menu.Item>
          <span>Email:<a  style={{fontSize:12,color:'#69b5e4',marginLeft:5}}>tilli@deloitte.com.cn</a></span>
        </Menu.Item>
        <Menu.Item>
        <span>phone:<a  style={{fontSize:12,color:'#69b5e4',marginLeft:5}}>+86 18502397990</a></span>
        </Menu.Item>
        <Menu.Item>
          <a style={{fontSize:12,color:'#69b5e4'}}>more</a>
        </Menu.Item>
      </Menu>
    );
    const menuXinxi = (
      <Menu className={styles.menu} style={{textAlign:'center'}} selectedKeys={[]}>
        <Menu.Item>
          税务大会
        </Menu.Item>
        <Menu.Item>
          税务大会
        </Menu.Item>
        <Menu.Item>
          <a style={{fontSize:12,color:'#69b5e4'}}>View all messages</a>
        </Menu.Item>
      </Menu>
    );
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item>
         <a href="/#/userInterface/userIndex" style={{color:"rgba(0,0,0,0.8)"}}>用户角色切换</a>
        </Menu.Item>
        {/* <Menu.Item>
          个人中心
        </Menu.Item> */}
        <Menu.Item>
          密码设置
        </Menu.Item>
        <Menu.Item key="logout">
          退出登录
        </Menu.Item>
      </Menu>
    );
    const userMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onUserMenuClick}>
      {isAdmin?
          <Menu.Item key="changeUserType">
            <Icon type="swap" theme="outlined" />
            <a href="/#/home/list" style={{ color: "rgba(0,0,0,0.8)", display: "inline-block" }}>
              {intl.formatMessage({ id: 'event.content.Change user type' })}
            </a>
          </Menu.Item>
          :
          ""
      }
        
        <Menu.Item key="personInfo">
          <Icon type="user" theme="outlined" />{intl.formatMessage({ id: 'event.content.Personal information' })} 
        </Menu.Item>
        <Menu.Item key="setting">
          <Icon type="setting" theme="outlined" />{intl.formatMessage({ id: 'event.content.Personal Setting' })} 
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" theme="outlined" />{intl.formatMessage({ id: 'event.content.Log out' })}
        </Menu.Item>
      </Menu>
    );
    const userMenu1 = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onUserMenuClick}>
        <Menu.Item key="logIn" style={{display:'none'}}>
          <Icon type="login" theme="outlined" />{intl.formatMessage({ id: 'event.content.Log In' })}
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <div className={!collapsed ? styles.logoicon : styles.logoiconhidden} key="logo" style={{marginLeft:57}} >
          <Link to={!!linkToUserIndex ? "/userInterface/userIndex" : "/home/list"}>
            <img src={logo} alt="logo"/>
          </Link>
        </div>
        {/* {isMobile && [
          <Link to="/user/login" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]} */}
        {hasSider?(
           <Icon
           className={styles.trigger}
           type={collapsed ? 'menu-unfold' : 'menu-fold'}
           onClick={this.toggle}
         />
        ):''}
        <div className={styles.right}>
        {/* <Dropdown overlay={menuLianxi}>
             <span className={styles.iconspan}>
                <i className={`${iconfont.iconfont} icon-tubiaolunkuo-`}/>
             </span>
          </Dropdown>
          <Dropdown overlay={menuXinxi} >
             <span className={styles.iconspan}>
                <i className={`${iconfont.iconfont} icon-xinxi`}/>
             </span>
          </Dropdown> */}
          <span className={styles.iconspan} style={{fontSize:12}} onClick={onLanguageSetting}  >
                <FormattedMessage id="navbar.lang" />
            </span>
          {/* {currentUser.name ? ( */}
          
          <Dropdown overlay={!!isAdminUser && !!name ? menu : !!sk&&!!name ? userMenu : <div></div>}>
            <span className={`${styles.action}`}>
              <Avatar size="small"style={{ backgroundColor: '#86bc25',top:"-28px"}} icon="user" />
              {/* <span className={styles.name}>{currentUser.name}</span> */}
              <span className={styles.iconspan_name} style={{ fontSize: 12 }} onClick={!!name ? this.noChange : handleLogin}>
                {!!name ? <FormattedMessage id="navbar.Welcome" /> : <FormattedMessage id="navbar.Please Login" />}{name}
              </span>
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
GlobalHeader.propTypes = {
  intl: intlShape.isRequired,
};
export default injectIntl(GlobalHeader)