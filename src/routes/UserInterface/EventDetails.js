import React, { Component } from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { Map,Marker} from 'react-amap'
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import { Row, Col, Icon, Form, Input, Select, Card, Menu, Dropdown, Button, Tabs, Anchor, Timeline , Divider,Modal ,Spin} from 'antd';
import { stringify } from 'qs';
import { formatMessage,injectIntl,intlShape } from 'react-intl';
import { getFullDate, getWeek } from '../../utils/utils';
import styles from './EventDetails.less'
import UserFooter from '../../components/UserFooter';
import DePanel from '../../components/DePanel';
import imgJoin from '../../assets/icon-join1.png';
import imgEnd from '../../assets/hdjs.png';
import imgStop from '../../assets/hdtzzc.png';
import imgysx from '../../assets/ysx.png';
import imgzwkf from '../../assets/zwkf.png';
import map from '../../assets/map.png';
import date from '../../assets/date.png';
import p1 from '../../assets/250x263.jpg';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

const TabPane = Tabs.TabPane;
const { Meta } = Card;
const { Link } = Anchor;

@connect(({ eventDetails, loading }) => ({ //连接modal
    eventDetails,
}))
@Form.create()
class EventDetails extends Component {

    anchorClick = (e,link) => {
        e.preventDefault();
        console.log(link);
    }

    handleJoinClick = (e, item) => {  //join按钮点击事件
        const { dispatch, eventDetails } = this.props;
        const { currentEvent } = eventDetails;
        if (!!currentEvent && !!currentEvent.Id) {
            this.props.dispatch(routerRedux.push({
                pathname: '/userInterface/registerEvent',
                search: stringify({
                    id: currentEvent.Id,
                })
            }));
        }
    }

    handleMapClick = (e) => {
        const { dispatch, eventDetails} = this.props;
        const { mapVisible } = eventDetails;
        dispatch({
            type:"eventDetails/changeMapVisible",
            payload:{
                mapVisible: !mapVisible
            }
        })
    }

    renderContentSummary = () => {
        const { eventDetails } = this.props;
        const { currentEvent, showOrHiddenObj } = eventDetails;
        let divEl = this.refs.contentSummary;
        if (!!currentEvent && !!currentEvent.ContentSummary && !!divEl){
            divEl.innerHTML = currentEvent.ContentSummary;
        }
    }

    renderShowSponsor = () => { 
        const { eventDetails } = this.props;
        const { currentEvent, showOrHiddenObj } = eventDetails;
        let sponsorsName='';
        if (!!currentEvent && !!currentEvent.SponsorInfo && currentEvent.SponsorInfo.length) {
            currentEvent.SponsorInfo.map((item,index)=>{
                if(index===currentEvent.SponsorInfo.length-1){
                    sponsorsName += item.ClientName
                }else{
                    sponsorsName += item.ClientName+","
                }
            })
        }
        return sponsorsName
    }
    
    renderTicketType = () => {  
        const { eventDetails } = this.props;
        const { currentEvent, showOrHiddenObj } = eventDetails;
        let ticketType = "";
        if (!!currentEvent && !!currentEvent.TicekInfo && !!currentEvent.TicekInfo.PriceType) {
            const type = currentEvent.TicekInfo.PriceType;
            if (type === "Standard"){
                ticketType = "标准票价";
            } else if (type === "Scene") {
                ticketType = "现场票价";
            } else if (type === "Free") {
                ticketType = "免费票";
            }
        }
        return ticketType;
    }

    handleSpeakerClick = (item) => {    //点击speaker事件
        const { eventDetails ,dispatch} = this.props;
        const { currentEvent, showOrHiddenObj } = eventDetails;
        if(!!item){
            dispatch({
                type: "eventDetails/changeSpeakerVisible",
                payload: {
                    speakerVisible: true
                }
            })
            dispatch({
                type: "eventDetails/saveCurrentSpeaker",
                payload: {
                    currentSpeaker: item
                }
            })
        }
    }

    handleSpeakerCancel = (e) => {  //speaker Modal关闭事件
        const { dispatch, eventDetails } = this.props;
        dispatch({
            type: "eventDetails/changeSpeakerVisible",
            payload: {
                speakerVisible: false
            }
        })
    }

    documentDownload = (id,index) => {    //点击文档名称下载当前文档
        const { dispatch }= this.props;
        if(!!id){
            dispatch({
                type:"eventDetails/changeLoadFile",
                payload:{
                    loadFile: true
                }
            })
            dispatch({
                type:"eventDetails/documentDownload",
                payload:{
                    DocumentId:id
                }
            })
            dispatch({
                type:"eventDetails/changeBtnDownload",
                payload:{
                    btnIndex:index
                }
            })
        }

    }
    renderImg = () => {
        const { dispatch, eventDetails} = this.props;
        const { currentEvent } = eventDetails;
        const RegisterFrom = currentEvent.RegisterFrom;
        const RegisterTo = currentEvent.RegisterTo;
        const Status = currentEvent.Status;
        let dom;
        if (currentEvent.HaveRegisterAccount >= currentEvent.Capacity){
            dom = <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgysx}` + ")", backgroundRepeat: "no-repeat", cursor: "default" }}></a>
        }else if (Status === 1009002){
            if (!!RegisterFrom && !!RegisterTo){
                let arr1 = RegisterFrom.split('-');
                let arr2 = RegisterTo.split('-');
                const fromDate = arr1[0] + arr1[1] + arr1[2];
                const endDate = arr2[0] + arr2[1] + arr2[2];
                const myDate = new Date();
                const str = myDate.getFullYear() + (myDate.getMonth() + 1) + myDate.getDate();
                if (str < fromDate){
                    dom = <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgzwkf}` + ")", backgroundRepeat: "no-repeat", cursor: "default" }}></a>
                } else if (str >= fromDate && str <= endDate){
                    dom = <a onClick={this.handleJoinClick} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat" }}></a>
                } else if (str > endDate) {
                    dom = <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgStop}` + ")", backgroundRepeat: "no-repeat", cursor: "default" }}></a>
                }
            }else{
                dom = <a onClick={this.handleJoinClick} className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgJoin}` + ")", backgroundRepeat: "no-repeat" }}></a>
            }
        } else if (Status === 1009004){
            dom = <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgEnd}` + ")", backgroundRepeat: "no-repeat", cursor: "default" }}></a>
        } else if (Status === 1009003) {
            dom = <a className={styles.imgPosition} style={{ backgroundImage: "url(" + `${imgStop}` + ")", backgroundRepeat: "no-repeat", cursor: "default" }}></a>
        }
        return dom;
    }
    render() {
        const { eventDetails } = this.props;
        const {intl} = this.props;
        const { 
            currentEvent, 
            mapVisible, 
            showOrHiddenObj, 
            speakerVisible, 
            currentSpeaker,
            loadFile
        } = eventDetails;
        const mapPlugins = ["ToolBar"];
        const mapCenter = { longitude: currentEvent.Longitude, latitude: currentEvent.Latitude  };
        const markerPosition = { longitude: currentEvent.Longitude, latitude: currentEvent.Latitude };
        let bankInfo;
        let speakerList;
        let dailyAgendaList;
        let organization;
        let documentInfo;
        let externalContactorInfo;
        if (!!currentEvent && !!currentEvent.BankInfo){
            bankInfo = currentEvent.BankInfo;
        } 
        if (!!currentEvent && !!currentEvent.SpeakerList){
            speakerList = currentEvent.speakerList;
        } 
        if (!!currentEvent && !!currentEvent.AgendaList && currentEvent.AgendaList.DailyAgendaList.length) {
            dailyAgendaList = currentEvent.AgendaList.DailyAgendaList;
        }
        if (!!currentEvent && !!currentEvent.OrganizationInfo && currentEvent.OrganizationInfo.length) {
            organization = currentEvent.OrganizationInfo[0];
        }
        if (!!currentEvent && !!currentEvent.DocumentInfo && currentEvent.DocumentInfo.length) {
            documentInfo = currentEvent.DocumentInfo;
        }
        if (!!currentEvent && !!currentEvent.ExternalContactorInfo) {
            externalContactorInfo = currentEvent.ExternalContactorInfo;
        }
        return (
            <Spin spinning={loadFile}>
                <div style={{ backgroundColor: "#FBFBFB" }}>
                <Row>
                    <Modal 
                        onCancel={this.handleSpeakerCancel}
                        width="700px"
                        footer={null}
                        visible={speakerVisible}
                        centered
                        title={intl.formatMessage({ id: 'event.content.Speaker' })}
                    >
                        <div style={{display:"block",width:"100%",height:"600px"}}>
                            <div style={{ textAlign: "center" }}>
                                <img width="35%" src={!!currentSpeaker && !!currentSpeaker.Photo ? currentSpeaker.Photo : p1}/>
                            </div>
                            <div className={styles.speakerName}>
                                {!!currentSpeaker.FirstName && !!currentSpeaker.LastName ? currentSpeaker.FirstName + currentSpeaker.LastName : ''}
                            </div>
                            <Row type="flex" justify="center">
                                <Col span={20}>
                                    <Row>
                                    
                                        <Col span={12}>{intl.formatMessage({ id: 'event.manage.EMail' })}：{!!currentSpeaker && !!currentSpeaker.Email ? currentSpeaker.Email : ''}</Col>
                                        <Col span={12}>{intl.formatMessage({ id: 'event.manage.CompanyName' })}：{!!currentSpeaker && !!currentSpeaker.CompanyName ? currentSpeaker.CompanyName : ''}</Col>
                                        <Col span={12}>{intl.formatMessage({ id: 'event.content.Position' })}：{!!currentSpeaker && !!currentSpeaker.JobTitle ? currentSpeaker.JobTitle : ''}</Col>
                                        <Col span={12}>{intl.formatMessage({ id: 'event.general.industry' })}：{!!currentSpeaker && !!currentSpeaker.Industry ? currentSpeaker.Industry : ''}</Col>
                                        <Col span={12}>{intl.formatMessage({ id: 'event.content.Website' })}：{!!currentSpeaker && !!currentSpeaker.Website ? currentSpeaker.Website : ''}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className={styles.introduction}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {!!currentSpeaker && !!currentSpeaker.Introduction ? currentSpeaker.Introduction : ''}
                            </div>
                        </div>
                    </Modal>
                </Row>
                <Row>
                    <Modal 
                        onCancel={this.handleMapClick}
                        width="700px"
                        footer={null}
                        visible={mapVisible}
                        centered
                        title={intl.formatMessage({ id: 'event.content.Geographical Position' })}
                    >
                        <div style={{display:"block",width:"100%",height:"600px"}}>
                            <Map 
                                plugins={mapPlugins}
                                center={mapCenter}
                                zoom={12}
                                amapkey="d81173dc5f095380dcdf9d83e8dbe073"
                            >
                                <Marker position={markerPosition} />
                            </Map>
                            {/* {!!currentEvent && !!currentEvent.VenueImage ? <img src={currentEvent.VenueImage} /> : <p>暂无图片！</p>} */}
                            
                        </div>
                    </Modal>
                </Row>

                <Row>
                    <div id="toggleLink">
                        <div className={styles.toggleLogo}>D&nbsp;<span>E</span>vent</div>
                        <div className={styles.anchor}>
                            <Anchor className={styles.anchorDiv} affix="false" showInkInFixed="false" onClick={this.anchorClick}>
                                {!!showOrHiddenObj.ShowDetails ? <Link style={{ color: "#fff" }} href="#hdxq" title={intl.formatMessage({ id: 'event.template.summary' })} />:""}
                                {!!showOrHiddenObj.ShowSchedule ? <Link style={{color:"#fff"}} href="#hdrc" title={intl.formatMessage({id:'event.content.Agenda'})} />:""}
                                {!!showOrHiddenObj.ShowSpeaker ? <Link style={{color:"#fff"}} href="#yjjb" title={intl.formatMessage({id:'event.content.Speakers'})} />:""}
                                {!!showOrHiddenObj.ShowTicket ? <Link style={{color:"#fff"}} href="#pwxx" title={intl.formatMessage({id:'event.content.Tickets'})} />:""}
                                {!!showOrHiddenObj.ShowDttEntity ? <Link style={{color:"#fff"}} href="#skzhxx" title={intl.formatMessage({id:'event.content.Payee (Entity)'})} />:""}
                                {!!showOrHiddenObj.ShowDocument ? <Link style={{color:"#fff"}} href="#wdxx" title={intl.formatMessage({id:'event.content.Documents'})} />:""}
                                <Link href="#bmycx" title={intl.formatMessage({id:'event.content.Registration and enquiry'})} />
                            </Anchor>
                        </div>
                    </div>
                </Row>

                <Row>
                    <div className={styles.carouselDiv}>
                        <div className={styles.navImgBar}>
                            <div className={styles.navImgBar_Title}>
                                <h1 className={styles.navImgBar_Title_h1}>{!!currentEvent && currentEvent.Title ? currentEvent.Title : ''}</h1>
                                <h2 className={styles.navImgBar_Title_h2}>{!!currentEvent && currentEvent.SubTitle ? currentEvent.SubTitle : ''}</h2>
                            </div>
                            {!!currentEvent && currentEvent.HeaderImage ? <img className={styles.navImgBar_Img} src={currentEvent.HeaderImage} /> : ''}
                        </div>
                        {/* {111
                            imgEnd
                            imgStop
                        } */}
                        {this.renderImg()}
                    </div>
                </Row>

                <Row gutter={12}>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 4 }}>
                        <Card className={styles.dateAndAddress}>
                            <Row>
                                <Col span={18}>
                                    <Row><h3>{intl.formatMessage({id:'event.content.Date'})}</h3></Row>
                                    <Row><h5>{getFullDate(currentEvent.StartDate)} - {getFullDate(currentEvent.EndDate)}</h5></Row>
                                    <Row><h5>{currentEvent.StartTime} - {currentEvent.EndTime}</h5></Row>
                                </Col>
                                <Col className={styles.h3_content}>
                                    <div className={styles.dateAndAddress_div_img}>
                                        <img src={date}/>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 0}}>
                        <Card className={styles.dateAndAddress}>
                            <Row>
                                <Col span={18}>
                                    <Row><h3>{intl.formatMessage({id:'event.content.Address'})}</h3></Row>
                                    <Row><h4>{currentEvent.VenueName}</h4></Row>
                                    <Row><h5>{currentEvent.Venue}</h5></Row>
                                </Col>
                                <Col className={styles.h3_content}>
                                    <div className={styles.dateAndAddress_div_img}>
                                        <img src={map} onClick={(e)=>{this.handleMapClick(e)}} style={{cursor:"pointer"}}/>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col span={16} offset={4}>
                        <div className={styles.zbf}>
                            <Row>
                                    <Col><h3>{intl.formatMessage({ id: 'event.content.Basic Message' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row gutter={12}>
                                        <Col span={8}>
                                            <Icon type="home" theme="outlined" />
                                            <h5>{intl.formatMessage({ id: 'event.content.Organizer' })}：{"Deloitte"}</h5>
                                        </Col>
                                        <Col span={8}>
                                            <Icon type="reconciliation" theme="outlined" />
                                            <h5>{intl.formatMessage({ id: 'event.general.industry' })}：{!!currentEvent.SectorChineseName ? currentEvent.SectorChineseName : ""}</h5>
                                        </Col>
                                        <Col span={8}>
                                            <Icon type="phone" theme="outlined" />
                                            <h5>{intl.formatMessage({ id: 'event.manage.Telephone' })}：{!!externalContactorInfo && !!externalContactorInfo.Phone ? externalContactorInfo.Phone : ""}</h5>
                                        </Col>
                                        <Col span={8}>
                                            <Icon type="user" theme="outlined" />
                                            <h5>{intl.formatMessage({ id: 'event.content.Contactor' })}：{!!externalContactorInfo && !!externalContactorInfo.FirstName && !!externalContactorInfo.LastName ? externalContactorInfo.FirstName + externalContactorInfo.LastName : ""}</h5>
                                        </Col>
                                        <Col span={8}>
                                            <Icon type="mail" theme="outlined" />
                                            <h5>{intl.formatMessage({ id: 'event.manage.EMail' })}：{!!externalContactorInfo && !!externalContactorInfo.Email ? externalContactorInfo.Email : ""}</h5>
                                        </Col>
                                        {/* <Col span={8} className={!!showOrHiddenObj.ShowSponsor ? "" : styles.hideItem}>
                                            <Icon type="bank" theme="outlined" />
                                            <h5>赞助商：{this.renderShowSponsor()}</h5>
                                        </Col> */}
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>                        
                </Row>

                <Row className={!!showOrHiddenObj.ShowDetails ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.hdxq}>
                            <Row>
                                <Col><h3 id="hdxq">{intl.formatMessage({ id: 'event.template.summary' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <div ref="contentSummary">{this.renderContentSummary()}</div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row className={!!showOrHiddenObj.ShowSchedule ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.hdrc}>
                            <Row>
                                <Col><h3 id="hdrc">{intl.formatMessage({ id: 'event.template.agenda' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row >
                                        <div ref="agendaRow">
                                            {!!dailyAgendaList && dailyAgendaList.length ? dailyAgendaList.map((item,index)=>{
                                                return <Col key={index} span={12}>
                                                            <span className={styles.agendaDate}>{item.AgendaDate}</span>
                                                            <Timeline>
                                                                {item.AgendaDetails.map((i,j)=>{
                                                                    return <Timeline.Item key={j}>{i.StartTime} - {i.EndTime}&nbsp;&nbsp;&nbsp;{i.Title}</Timeline.Item>
                                                                })}
                                                            </Timeline>
                                                        </Col>
                                            }):""}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row className={!!showOrHiddenObj.ShowSpeaker ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.yjjb}>
                            <Row>
                                <Col><h3 id="yjjb">{intl.formatMessage({ id: 'event.template.speakers' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row gutter={12}>
                                        {!!currentEvent && !!currentEvent.SpeakerList && !!currentEvent.SpeakerList.length ?
                                            currentEvent.SpeakerList.map((item,index)=>{
                                                    {/* return <Col key={index} sm={7}> */}
                                                    return <div key={index} className={styles.yjjb_card}>
                                                            <Card
                                                                hoverable
                                                                onClick={() => { this.handleSpeakerClick(item)}}
                                                                style={{ width: 250,float:'left',marginRight:"15px" }}
                                                                cover={<img alt="example" width="250px" height="263px" src={!!item.Photo ? item.Photo : p1} />}
                                                            >
                                                                <Meta
                                                                    title={!!item.FirstName && !!item.LastName ? item.FirstName + item.LastName : ""}
                                                                    description={<div><p>{!!item.CompanyName ? item.CompanyName : ""}</p><p>{!!item.JobTitle ? item.JobTitle : ""}</p></div>}
                                                                />
                                                            </Card>
                                                        </div>
                                            })
                                            :
                                            ""
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row className={!!showOrHiddenObj.ShowTicket ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.pwxx}>
                            <Row>
                                <Col><h3 id="pwxx">{intl.formatMessage({ id: 'event.template.tickets' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <div className={styles.pwxx_zffs}>
                                        <Row>{!!currentEvent && !!currentEvent.TicekInfo && !!currentEvent.TicekInfo.Name ? currentEvent.TicekInfo.Name : ''}</Row>
                                        <Divider className="divider"></Divider>
                                        <Row>
                                            <Col span={20}>{this.renderTicketType()}</Col>
                                            <Col span={2} offset={2}>
                                                <div className={styles.price}>
                                                    {!!currentEvent && !!currentEvent.TicekInfo && !!currentEvent.TicekInfo.Price ? `¥${currentEvent.TicekInfo.Price}` : ''}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row className={!!showOrHiddenObj.ShowDttEntity ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.skzhxx}>
                            <Row>
                                <Col><h3 id="skzhxx">{intl.formatMessage({ id: 'event.content.Payee (Entity)' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row>
                                        <Col>{!!bankInfo ? bankInfo.AccountName : ""}</Col>
                                        <Col>{intl.formatMessage({ id: 'event.content.Bank of Deposit' })}：<span>{!!bankInfo ? bankInfo.BankName : ""}</span></Col>
                                        <Col>{intl.formatMessage({ id: 'event.ticket.name' })}：<span>{!!bankInfo ? bankInfo.Description : ""}</span></Col>
                                        <Col>{intl.formatMessage({ id: 'event.content.Bank Account Number' })}：<span>{!!bankInfo ? bankInfo.AccountNumber : ""}&nbsp;{!!bankInfo ? bankInfo.Currency : ""}</span></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row className={!!showOrHiddenObj.ShowDocument ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.wdxx}>
                            <Row>
                                <Col><h3 id="wdxx">{intl.formatMessage({ id: 'event.content.Documents' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row>
                                        {!!documentInfo && !!documentInfo.length ? documentInfo.map((item,index)=>{
                                            return <Col key={index} span={6}>
                                                        <Icon style={{ fontSize: "22px" }} type="file" theme="outlined" />
                                                        <a ref={`btnDownload${index}`} onClick={() => { this.documentDownload(item.DocumentId,index)}}>{item.DocumentName}</a>
                                                    </Col>
                                        }):""}
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/*111*/}
                <Row className={!!showOrHiddenObj.ShowSponsor ? "" : styles.hideItem}>
                    <Col span={16} offset={4}>
                        <div className={styles.hdxq}>
                            <Row>
                                <Col><h3>{intl.formatMessage({ id: 'event.manage.Sponsor' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <div>
                                        {!!currentEvent && !!currentEvent.SponsorInfo && currentEvent.SponsorInfo.length?
                                            currentEvent.SponsorInfo.map((item,index)=>{
                                                    if (!item.IsSponsorVisiable){
                                                        return <div key={index}>
                                                            <p style={{ fontWeight: 'bold' }}>{item.ClientName}</p>
                                                            <p>{item.Description}</p>
                                                        </div>
                                                    }
                                            })
                                            :
                                            ""
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={16} offset={4}>
                        <div className={styles.bmycx}>
                            <Row>
                                <Col><h3 id="bmycx">{intl.formatMessage({ id: 'event.content.Registration and enquiry' })}</h3></Col>
                                <Col className={styles.h3_content}>
                                    <Row>
                                            <Col>我们诚挚地邀请阁下届时拔冗莅临。请完整填写参加者信息，并于{getFullDate(currentEvent.StartDate)} （{!!currentEvent && !!currentEvent.StartDate ? getWeek(currentEvent.StartDate) : ""}）前完成报名。席位有限，先到先得。如有任何查询，欢迎随时与我们联系。</Col>
                                    </Row>
                                    {/* <Row>
                                        <div className={styles.bmycx_tips}>
                                            <Col>
                                                语言：中文/英文双语。
                                            </Col>
                                        </div>
                                    </Row> */}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <UserFooter intl={intl}></UserFooter>
                </Row>
            </div>
            </Spin>
        );
    }
}
export default connect()(injectIntl(EventDetails))