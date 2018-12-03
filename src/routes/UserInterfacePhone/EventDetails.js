import React, { Component } from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { Map, Marker } from 'react-amap'
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import { Row, Col, Icon, Form, Input, Select, Card, Menu, Dropdown, Button, Tabs, Anchor, Timeline, Divider, Modal} from 'antd';
import styles from './EventDetails.less'
import UserFooter from '../../components/UserFooter';
import DePanel from '../../components/DePanel';
import imgUrl from '../../assets/user-banner1.jpg';
import imgJoin from '../../assets/icon-join1.png';
import map from '../../assets/map.png';
import date from '../../assets/date.png';
import p1 from '../../assets/p1.jpg';
import p2 from '../../assets/p2.jpg';
import p3 from '../../assets/p3.jpg';

const TabPane = Tabs.TabPane;
const { Meta } = Card;
const { Link } = Anchor;

@connect(({ eventDetails, loading }) => ({ //连接modal
    eventDetails,
}))
@Form.create()
export default class EventDetails extends Component {

    anchorClick = (e) => {
        e.preventDefault();
        console.log(link);
    }

    handleJoinClick = (e, item) => {  //join按钮点击事件
        const { dispatch, eventDetails } = this.props;
        const { currentEvent } = eventDetails;
        if (!!currentEvent && !!currentEvent.Id) {
            localStorage.setItem("currentEvent", JSON.stringify(currentEvent)); //这里是设置  
            this.props.dispatch(routerRedux.push({
                pathname: '/userInterface/registerEventPhone',
                state: {
                    currentEvent: currentEvent,
                }
            }));
        }
    }
    
    handleMapClick = (e) => {
        const { dispatch, eventDetails } = this.props;
        const { mapVisible } = eventDetails;
        dispatch({
            type: "eventDetails/changeMapVisible",
            payload: {
                mapVisible: !mapVisible
            }
        })
    }

    render() {
        const { eventDetails } = this.props;
        const { currentEvent ,mapVisible} = eventDetails;
        const mapPlugins = ["ToolBar"];
        const mapCenter = { longitude: 106.55, latitude: 29.57 };
        const markerPosition = { longitude: 106.55, latitude: 29.57 };
        return (
            <div style={{ backgroundColor: "#FBFBFB" }}>
                <Row>
                    <Modal
                        onCancel={this.handleMapClick}
                        width="700px"
                        footer={null}
                        visible={mapVisible}
                        centered
                        title="地理位置"
                    >
                        <div style={{ display: "block", width: "200px", height: "200px" }}>
                            <Map
                                plugins={mapPlugins}
                                center={mapCenter}
                                zoom={12}
                                amapkey="d81173dc5f095380dcdf9d83e8dbe073"
                            >
                                <Marker position={markerPosition} />
                            </Map>
                        </div>
                    </Modal>
                </Row>
                {/* <Row>
                    <div id="toggleLink">
                        <div className={styles.toggleLogo}><span>E</span>vent</div>
                        <div className={styles.anchor}>
                            <Anchor className={styles.anchorDiv} affix="false" showInkInFixed="false">
                                <Link href="#hdxq" title="活动详情" onClick={(e) => { this.anchorClick(e) }}/>
                                <Link href="#hdrc" title="活动日程" onClick={(e) => { this.anchorClick(e) }}/>
                                <Link href="#pwxx" title="票务信息" onClick={(e) => { this.anchorClick(e) }}/>
                                <Link href="#bmycx" title="报名与垂询" onClick={(e) => { this.anchorClick(e) }}/>
                            </Anchor>
                        </div>
                    </div>
                </Row> */}

                <Row>
                    <div className={styles.carouselDiv}>
                        <img width='100%' src={`${imgUrl}`} />
                        <a onClick={this.handleJoinClick} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat" }}></a>
                    </div>
                </Row>

                <Row gutter={12}>
                    {/* <Col span={8} offset={4}> */}
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 4 }}>
                        <Card className={styles.dateAndAddress}>
                            <Row>
                                <Col xs={{ span: 18 }}>
                                    <Row><h3>日期</h3></Row>
                                    <Row><h5>{currentEvent.StartDate}</h5></Row>
                                    <Row><h5>{currentEvent.StartDate}</h5></Row>
                                </Col>
                                <Col>
                                    <div className={styles.dateAndAddress_div_img}>
                                        <img src={date}/>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* <Col span={8}> */}
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0}}>
                        <Card className={styles.dateAndAddress}>
                            <Row>
                                <Col xs={{span:18}}>
                                    <Row><h3>地址</h3></Row>
                                    <Row><h5>{currentEvent.Address}</h5></Row>
                                </Col>
                                <Col>
                                    <div className={styles.dateAndAddress_div_img}>
                                        <img src={map} onClick={(e) => { this.handleMapClick(e) }} style={{ cursor: "pointer" }}/>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.zbf}>
                            <Row>
                                <Col>
                                    <h3>主办方</h3>
                                </Col>
                                <Col>
                                    <Row gutter={12}>
                                        <Col xs={{ span: 24 }}>
                                            <Icon type="home" theme="outlined" />
                                            <h5>主办方：Deloitte</h5>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Icon type="phone" theme="outlined" />
                                            <h5>电话：+86 57189727622</h5>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Icon type="user" theme="outlined" />
                                            <h5>联系人：Tracy Wu</h5>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Icon type="mail" theme="outlined" />
                                            <h5>邮箱：trawu@deloitte.com.cn</h5>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>                        
                </Row>

                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.hdxq}>
                            <Row>
                                <Col><h3 id="hdxq">活动详情</h3></Col>
                                <Col>
                                    <p>{currentEvent.Description}</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.hdrc}>
                            <Row>
                                <Col><h3 id="hdrc">活动日程</h3></Col>
                                <Col>
                                    <Timeline>
                                        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                                    </Timeline>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.yjjb}>
                            <Row>
                                <Col><h3 id="yjjb">演讲嘉宾</h3></Col>
                                <Col>
                                    <Row gutter={12}>
                                        <Col xs={{ span: 12 }} lg={{ span: 8 }} sm={{ span: 8 }}>
                                            <Card
                                                hoverable
                                                style={{ width: 150 }}
                                                cover={<img alt="example" src={p1} />}
                                            >
                                                <Meta
                                                    title="Europe Street beat"
                                                    description="www.instagram.com"
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={{ span: 12 }} lg={{ span: 8 }} sm={{ span: 8 }}>
                                            <Card
                                                hoverable
                                                style={{ width: 150 }}
                                                cover={<img alt="example" src={p2} />}
                                            >
                                                <Meta
                                                    title="Europe Street beat"
                                                    description="www.instagram.com"
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={{ span: 12 }} lg={{ span: 8 }} sm={{ span: 8 }}>
                                            <Card
                                                hoverable
                                                style={{ width: 150 }}
                                                cover={<img alt="example" src={p3} />}
                                            >
                                                <Meta
                                                    title="Europe Street beat"
                                                    description="www.instagram.com"
                                                />
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.pwxx}>
                            <Row>
                                <Col><h3 id="pwxx">票务信息</h3></Col>
                                <Col>
                                    <div className={styles.pwxx_zffs}>
                                        <Row>现场支付</Row>
                                        <Row>上午场，不包含午餐（9：30-12：00）</Row>
                                        <Divider className="divider"></Divider>
                                        <Row>
                                            <Col span={20}>现场票价</Col>
                                            <Col span={2} offset={2}>
                                                <div className={styles.price}>¥200</div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0 }}>
                        <div className={styles.bmycx}>
                            <Row>
                                <Col><h3 id="bmycx">报名与垂询</h3></Col>
                                <Col>
                                    <Row>
                                        <Col>我们诚挚地邀请阁下届时拔冗莅临。请完整填写参加者信息，并于2018年9月14日（星期五）前完成报名。每家公司限两人参加，席位有限，先到先得。如有任何查询，欢迎随时与我们联系。</Col>
                                    </Row>
                                    <Row>
                                        <div className={styles.bmycx_tips}>
                                            <Col>
                                                注：“一对一咨询”每场限一家企业参加，名额有限，先到先得。最终名额由工作人员单独发送邮件和电话进行确认；语言：中文/英文双语。
                                            </Col>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* <Row>
                    <UserFooter></UserFooter>
                </Row> */}
            </div>
        );
    }
}