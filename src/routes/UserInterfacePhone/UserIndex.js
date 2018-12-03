import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import antd,{Carousel,Row,Col,Input,Modal,Table,Dropdown,Menu,Button,Icon,Radio,Card,List,Tabs,Avatar } from 'antd';
import { stringify } from 'qs';
import styles from './UserIndex.less'
import imgUrl from '../../assets/user-banner1.jpg';
import imgJoin from '../../assets/icon-more.png';
import photorobit from '../../assets/photorobit.png';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const data = [];
for (let i = 0; i <3; i++) {
  data.push({
      href: '',
      title: `Current in Progress`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description: '获取英国，意大利居留权及相关国际税务考量分享会一对一会谈',
      content: '华润大厦 深圳市-广东省',
  });
}

@connect(({ userIndex, loading }) => ({ //连接modal
  userIndex,
}))
export default class UserIndex extends Component {


  componentDidMount = () => {
    //判断是pc端还是c端
    // const sUserAgent = navigator.userAgent.toLowerCase(); 
    // const bIsIpad = sUserAgent.match(/ipad/i) == "ipad"; 
    // const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"; 
    // const bIsMidp = sUserAgent.match(/midp/i) == "midp"; 
    // const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; 
    // const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"; 
    // const bIsAndroid = sUserAgent.match(/android/i) == "android"; 
    // const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"; 
    // const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"; 
    // if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    //   alert('移动端设备') 
    // } else {
    //   alert('pc端设备') 
    // }
  }

  handleJoinClick = (e, item) => {  //join按钮点击事件
    const {dispatch ,userIndex} = this.props;
    if(!!item && !!item.Id){
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/eventDetailsPhone',
        search: stringify({
          id: item.Id,
        })
      }));
    }
  }
  onChange= (a, b, c) =>{ //走马灯切换调用函数
    
  }

  dataListTitleClick = (e,item) =>{
    const {dispatch , userIndex} = this.props;
    if (!!item && !!item.Id) {
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/eventDetailsPhone',
        search: stringify({
          id: item.Id,
        })
      }));
    }
  }
  
  handleClick = ( e , item ) => { //List 中 Register按钮点击跳转到注册活动页面
    const { dispatch, userIndex } = this.props;
    if (!!item && !!item.Id) {
      localStorage.setItem("currentEvent", JSON.stringify(item)); //这里是设置  
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/registerEvent',
        state: {
          currentEvent: item,
        },
      }));
    }
  }

  handleTitleClick = (e,item) => {
    const { dispatch, userIndex } = this.props;
    if (!!item && !!item.Id) {
      localStorage.setItem("currentEvent", JSON.stringify(item)); //这里是设置  
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/eventDetailsPhone',
        state: {
          currentEvent: item,
        },
        search: stringify({
          id: item.id,
        })
      }));
    }
  }

  renderList = (list)=> {
    let dom = [];
    if (!!list.length){
      list.map((item,index)=>{
        dom.push(
          <Col xs={{span:22,offset:1}} key={index}>
            <div className={styles.eventListPhone}>
              <Row>
                <Col xs={{ span: 8 }}>
                  <img src={photorobit} width="75%" height="70px" />
                </Col>
                <Col xs={{ span: 16 }}>
                  <Row>
                    <Col xs={{ span: 24 }}><span onClick={(e)=>{this.handleTitleClick(e,item)}} className={styles.eventListPhone_Title}>{item.Title}</span></Col>
                    <Col xs={{ span: 24 }}><span className={styles.eventListPhone_Description}>{!!item.Description ? item.Descriptio : "这里是会议描述。。。"}</span></Col>
                    <Col xs={{ span: 24 }}>
                      <span className={styles.eventListPhone_Address}>{item.Address}</span>
                      <span className={styles.eventListPhone_StartDate}>{item.StartDate}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        )
      })
    }else{
      dom.push(
        <Col xs={{ span: 22, offset: 1 }} key="noItem">
          <div className={styles.noItem}>
            暂无数据
          </div>
        </Col>
      )
    }
    return dom
  } 

  render() {
    const {userIndex} = this.props;
    const { currentInProgressDataList , top5Events , visible , currentEventState } = userIndex;
    return (
      <div>
        <Row>
          <Carousel 
            afterChange={this.onChange}
            autoplay={false}
            arrows={false}
            prevArrow={<Icon type="left-circle-o" />}
            nextArrow={<Icon type="right-circle-o" />}
          >
          {
              !!top5Events && top5Events.length ? top5Events.map((item,index)=>{
                return <div className={styles.carouselDiv} key={item.Id}>
                  <img width='100%' src={`${imgUrl}`} />
                  <a onClick={(e) => { this.handleJoinClick(e, item) }} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat", }}></a>
                </div>
              }) 
              :
              <div>
                  <div className={styles.carouselDiv}>
                    <img width='100%' src={`${imgUrl}`} />
                    <a onClick={this.handleJoinClick} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat"}}></a>
                  </div>
              </div>
          }

          </Carousel>
        </Row>
        <Row gutter = {24}>
          {this.renderList(currentInProgressDataList)}
        </Row>
      </div>
    );
  }
}