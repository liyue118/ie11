import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import antd, { 
  Carousel, 
  Row, 
  Col, 
  Input, 
  Modal, 
  Table, 
  Dropdown, 
  Menu, 
  Button, 
  Icon, 
  Radio, 
  Card, 
  List, 
  Tabs, 
  Avatar, 
  Spin, 
  Tooltip,
  message
 } from 'antd';
import { stringify } from 'qs';
import { getWeek } from '../../utils/utils';
import { formatMessage,injectIntl,intlShape } from 'react-intl';
import styles from './UserIndex.less'
import imgUrl from '../../assets/user-banner1.jpg';
import imgJoin from '../../assets/icon-more.png';
import bgImg from '../../assets/1366-bg.jpg';
import photorobit from '../../assets/photorobit.png';
import { getCookie } from '../../utils/utils';
const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(({ userIndex, loading }) => ({ //连接modal
  userIndex,
}))
class UserIndex extends Component {

  state = {
    sk: getCookie("sk") != null ? getCookie("sk") : ''
  }
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

  handleJoinClick = (item) => {  //join按钮点击事件
    const {dispatch ,userIndex} = this.props;
    if(!!item && !!item.Id){
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/eventDetails',
        search: stringify({
          id: item.Id,
        })
      }));
    }
  }
  onChange= (a, b, c) =>{ //走马灯切换调用函数
    
  }   

  tabsCallback = (key) => { //tabs 切换调用函数
    const { dispatch, userIndex} = this.props;
    const {page,pageSize} =userIndex
    dispatch({
      type: "userIndex/resetPage",
      payload: {
        pageSize: 15,
        page: {
          ItemsPerPage: 15,
          Page: 1,
          TotalPages: 1,
          TotalRecords: 0,
        }
      }
    })
    dispatch({  //重置dataList
      type:"userIndex/renderDataList",
      payload:{
        dataList:[]
      }
    })
    dispatch({
      type: 'userIndex/getEventListByStatus',
      payload: {
        'Filter': key,
        'QueryClause': null,
        'OrderBy': '',
        'Page': 1,
        'ItemsPerPage': '15',
        'IsExport': false
      }
    })
    dispatch({
      type:"userIndex/changePageSize",
      payload:{
        pageSize:15
      }
    })
  }

  myTabsCallback = (key) => { //tabs 切换调用函数
    const {dispatch} = this.props;
    dispatch({
      type: "userIndex/resetPage",
      payload: {
        pageSize: 15,
        page: {
          ItemsPerPage: 15,
          Page: 1,
          TotalPages: 1,
          TotalRecords: 0,
        }
      }
    })
    dispatch({
      type: "userIndex/renderDataList",
      payload: {
        dataList: []
      }
    })
    if (key === "1") {
      dispatch({
        type: 'userIndex/eventMineAddition',
        payload: {
          'Filter': '',
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false
        }
      })
    }else if (key ==="2"){
      dispatch({
        type: 'userIndex/eventMineStarting',
        payload: {
          'Filter': '',
          'QueryClause':null,
          'OrderBy':'',
          'Page':1,
          'ItemsPerPage':'15',
          'IsExport':false
        }
      })
    } else if (key === "3") {
      dispatch({
        type: 'userIndex/eventMineAttendee',
        payload: {
          'Filter': '',
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false
        }
      })
    }
  }

  callback = (key) => { // home myEvent 切换回掉函数
    const { dispatch } = this.props;
    dispatch({
      type:"userIndex/changeDomLoading",
      payload:{
        domLoading:true
      }
    })
    dispatch({
      type: "userIndex/changeEventState",
      payload: {
        currentEventState: key
      }
    });
    dispatch({
      type:"userIndex/renderDataList",
      payload:{
        dataList:[]
      }
    })
    if (key ==="MyEvent"){
      dispatch({
        type: "userIndex/eventMineAddition",
        payload: {
          'Filter': '',
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false
        }
      })
    }else if(key ==="Home"){
      dispatch({
        type: 'userIndex/getEventListByStatus',
        payload: {
          'Filter': 1009002,
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false          
        }
      });
    }
  }

  dataListTitleClick = (e,item) =>{
    const {dispatch , userIndex} = this.props;
    console.log('item',item)
    if(!!item.Id){
      item.EventId=item.Id;
    }
    if (!!item && !!item.EventId) {
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/eventDetails',
        search: stringify({
          id: item.EventId,
        })
      }));
    }
  }

  showDescription = (item) => {
    if(!!item){
      const SubTitle = <span>{item.SubTitle}</span>
      const addressAndDate = <span>{!!item.Venue ? item.Venue : ""} {!!item.StartDate ? item.StartDate : ""} {!!item.StartTime ? item.StartTime : ""} {!!item.StartDate ? getWeek(item.StartDate) : ""}</span>
      return(
        <div>
            {
              !!item.SubTitle ? 
                <Tooltip title={SubTitle}>
                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>{item.SubTitle }</span>
                  </p>
                </Tooltip>
              : 
                ""
              }
            <Tooltip title={addressAndDate}>
              <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span>{!!item.Venue ? item.Venue : ""}</span>
                <span>&nbsp;&nbsp;&nbsp;{!!item.StartDate ? item.StartDate : ""}</span>
                <span>&nbsp;&nbsp;&nbsp;{!!item.StartTime ? item.StartTime : ""}</span>
                <span>&nbsp;&nbsp;&nbsp;{!!item.StartDate ? getWeek(item.StartDate) : ""}</span>
              </p>
            </Tooltip>
        </div>
      )
    }
  }

  showCountDown = (item,isHidden) => {
    if(!!item){
      return(
        <Row>
          <div style={isHidden ? { border: "1px solid #ddd", padding: "3px 7px", boxShadow: " 0 0 0 1px", visibility: "hidden", position: "relative", top: '-9px' } : { border: "1px solid #ddd", padding: "3px 7px", boxShadow: " 0 0 0 1px", position: "relative", top: '-9px' }}>
            <Col>
              <div style={{ lineHeight:"35px"}}>
                <span style={{ fontSize: "20px", margin: "0px 7px", color: "#81B424" }}>{item.DaysRemain}</span>
                <span style={{ color: "#81B424" }}>days</span>
              </div>
            </Col>
            <Col>countdown</Col>
          </div>
        </Row>
      )
    }
  }
  
  handleClick = ( e , item ) => { //List 中 Register按钮点击跳转到注册活动页面
    const { dispatch, userIndex } = this.props;
    if (!!item.EventId){
      item.Id = item.EventId;
    }
    if (!!item && !!item.Id) {
      localStorage.setItem("currentEvent", JSON.stringify(item)); //这里是设置  
      this.props.dispatch(routerRedux.push({
        pathname: '/userInterface/registerEvent',
        search: stringify({
          id: item.Id,
        })
      }));
    }
  }

  handleOnlinePayClick = (e,item) => {
    console.log('item', item);
    message.warning('暂未支持在线支付功能！');
  }

  renderBtn = (item) => {
      // ApprovalStatus:{
      //   提交待审核:1003001,=>submitted
      //   审核通过待付款:1003002,=>Approved
      //   已付款:1003003,=>Paid
      //   已参加会议:1003004,=>Attended
      //   审核被拒绝:1003005,=>Rejected
      //   已取消:1003006,=>Canceled
      // }
    let dom;
    // item.ApprovalStatus = 1003002 //测试数据
    if (!!item && !!item.ApprovalStatus){
      if (item.ApprovalStatus === 1003001){
        dom = <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
          <span>等待审核</span>
        </div>
      } else if (item.ApprovalStatus === 1003002){
        dom = <div style={{ textAlign: "center"}}>
          <Button type="defalut" onClick={(e) => { this.handleOnlinePayClick(e, item) }}>
            在线支付<Icon type="arrow-right" theme="outlined" />
          </Button>
        </div>
      } else if (item.ApprovalStatus === 1003003){
        dom = <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
          <span>已付款</span>
        </div>
      } else if (item.ApprovalStatus === 1003004) {
        dom = <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
          <span>已结束</span>
        </div>
      } else if (item.ApprovalStatus === 1003005) {
        dom = <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
          <span>审核未通过</span>
        </div>
      } else if (item.ApprovalStatus === 1003006) {
        dom = <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
          <span>已取消</span>
        </div>
      }
    }
    return dom;
  }

  // onShowSizeChange = (pageNumber) =>{
  //   console.log('pageNumber', pageNumber);
  // }

  render() {
    const {userIndex} = this.props;
    const {intl} = this.props;
    const {sk} = this.state;
    const { 
      dataList, 
      top5Events, 
      visible, 
      currentEventState,
      domLoading,
      page,
      pageSize,
      defaultActiveKey,
    } = userIndex;
    return (
      <div>
        <Row>
          <div id="toggleLink">
            <div className={styles.toggleLogo}>D&nbsp;<span>E</span>vent</div>
            <Tabs defaultActiveKey={defaultActiveKey} onChange={this.callback}>
              <TabPane tab={intl.formatMessage({ id: 'event.content.Home' })} key="Home" >Home</TabPane>
              {!!sk ? <TabPane tab={intl.formatMessage({ id: 'event.content.My Event' })} key="MyEvent" >My Event</TabPane>:""}
            </Tabs>
          </div>
        </Row>
        <Row>
          <Carousel 
            afterChange={this.onChange}
            autoplay={true}
            arrows={true}
            prevArrow={<Icon type="left-circle-o" />}
            nextArrow={<Icon type="right-circle-o" />}
          >
          {
              !!top5Events && top5Events.length ? top5Events.map((item,index)=>{
                return <div key={index} className={styles.carouselDiv}>
                  <div className={styles.navImgBar}>
                    <div className={styles.navImgBar_Title}>
                      <h1 className={styles.navImgBar_Title_h1}>{!!item && item.Title ? item.Title : ''}</h1>
                      <h2 className={styles.navImgBar_Title_h2}>{!!item && item.SubTitle ? item.SubTitle : ''}</h2>
                    </div>
                    {!!item && item.HeaderImage ? <img className={styles.navImgBar_Img} src={item.HeaderImage}/>:''}
                  </div>
                  <a onClick={() => { this.handleJoinClick(item) }} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat",backgroundSize: "140px" }}></a>
                </div>
              }) 
              :
              <div>
                  <div className={styles.carouselDiv}>
                    {/* <img width='100%' src={`${imgUrl}`} />
                    <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat", backgroundSize: "140px" }}></a> */}
                  </div>
              </div>
          }

          </Carousel>
        </Row>
        <Row gutter = {24}>
          <Spin spinning = {domLoading}>
            <Card style={{ border: 0 }}>
              <Col span={20} offset={2}>
                {currentEventState === "Home" ?
                  <Tabs defaultActiveKey="1009002" onChange={this.tabsCallback}>
                    <TabPane tab={intl.formatMessage({id:'event.content.Upcoming'})} key="1009002">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch, userIndex } = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize }
                            });
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009002',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009002',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : photorobit} />}
                          >
                            <List.Item.Meta
                              description={this.showCountDown(item,false)}
                            />
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row className={styles.EventBtns}>
                                <Col span={11} offset={11}>
                                  <div style={{ lineHeight: "42px" }}>
                                    <Button type="defalut" onClick={(e) => { this.handleClick(e, item) }}>
                                    {intl.formatMessage({id:'event.content.Register'})}<Icon type="arrow-right" theme="outlined" />
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id:'event.content.In Progress'})} key="1009003">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch, userIndex } = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize }
                            });
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009003',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009003',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : photorobit} />}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row>
                                <Col span={11} offset={11}>
                                  <div style={{ textAlign:"center",lineHeight: "32px",height:"32px",width:"90px",border:"1px solid #ddd",boxShadow:"0 0 0 1px" }}>
                                    <span>{intl.formatMessage({ id:'event.content.In Progress'})}</span>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab={intl.formatMessage({id:'event.content.Past'})} key="1009004">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch ,userIndex} = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize}
                            });
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009004',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/getEventListByStatus',
                              payload: {
                                'Filter': '1009004',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}                        
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : photorobit} />}
                          >

                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row>
                                <Col span={11} offset={11}>
                                  <div style={{ textAlign: "center", lineHeight: "32px", height: "32px", width: "90px", border: "1px solid #ddd", boxShadow: "0 0 0 1px" }}>
                                    <span>{intl.formatMessage({id:'event.content.Past'})}</span>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  </Tabs>
                  :
                  <Tabs defaultActiveKey="1" onChange={this.myTabsCallback}>
                    <TabPane tab={intl.formatMessage({id:'event.content.My Registered Events'})} key="1">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch, userIndex } = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize }
                            });
                            dispatch({
                              type: 'userIndex/eventMineAddition',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/eventMineAddition',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : !!item.HeaderImage ? item.HeaderImage : photorobit} />}
                          >
                            {!!item && item.ApprovalStatus === 1003004 ? <List.Item.Meta description={this.showCountDown(item,true)} /> :
                              !!item && !!item.DaysRemain && item.DaysRemain>=0 ? 
                                <List.Item.Meta description={this.showCountDown(item, false)} /> : <List.Item.Meta description={this.showCountDown(item, true)} />
                            }
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row>
                                <Col span={11} offset={11}>
                                  {this.renderBtn(item)}
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id:'event.content.My Upcoming Events'})} key="2">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch, userIndex } = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize }
                            });
                            dispatch({
                              type: 'userIndex/eventMineStarting',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/eventMineStarting',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : !!item.HeaderImage ? item.HeaderImage : photorobit} />}
                          >
                            {!!item && item.ApprovalStatus === 1003004 ? <List.Item.Meta description={this.showCountDown(item,true)} /> :
                              !!item && !!item.DaysRemain && item.DaysRemain >= 0 ? 
                                <List.Item.Meta description={this.showCountDown(item, false)} /> : <List.Item.Meta description={this.showCountDown(item, true)} />
                            }
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row>
                                <Col span={11} offset={11}>
                                  {this.renderBtn(item)}
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>

                    <TabPane tab={intl.formatMessage({id:'event.content.My Past Events'})} key="3">
                      <List id="userIndexList"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onShowSizeChange: (current, pageSize) => {
                            const { dispatch, userIndex } = this.props;
                            dispatch({
                              type: "userIndex/changePageSize",
                              payload: { pageSize: pageSize }
                            });
                            dispatch({
                              type: 'userIndex/EventMineAttendee',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': current,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          onChange: (pageNumber) => {
                            const { dispatch, userIndex } = this.props;
                            const { pageSize } = userIndex;
                            dispatch({
                              type: 'userIndex/EventMineAttendee',
                              payload: {
                                'Filter': '',
                                'QueryClause': null,
                                'OrderBy': '',
                                'Page': pageNumber,
                                'ItemsPerPage': pageSize,
                                'IsExport': false
                              },
                            })
                          },
                          showSizeChanger: true,
                          pageSize: pageSize,
                          total: page.TotalRecords,
                        }}
                        dataSource={dataList}
                        renderItem={item => (
                          <List.Item
                            key={item.Id}
                            extra={<img width={155} height={155} alt="logo" src={!!item && !!item.EventImage ? item.EventImage : !!item.HeaderImage ? item.HeaderImage : photorobit} />}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar} />}
                              title={
                                <Tooltip title={item.Title}>
                                  <p style={{ margin: "0px", maxWidth: "370px", overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a onClick={(e) => { this.dataListTitleClick(e, item) }}>
                                      {item.Title}
                                    </a>
                                  </p>
                                </Tooltip>
                              }
                              description={this.showDescription(item)}
                            />
                            <div>
                              <Row>
                                <Col span={11} offset={11}>
                                  <div style={{ lineHeight: "42px" }}>
                                    <Button type="defalut" onClick={(e) => { this.handleClick(e, item) }}>
                                    {intl.formatMessage({id:'event.content.Register'})}<Icon type="arrow-right" theme="outlined" />
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  </Tabs>
                }
              </Col>
            </Card>            
          </Spin>  
        </Row>
      </div>
    );
  }
}
export default connect()(injectIntl(UserIndex))