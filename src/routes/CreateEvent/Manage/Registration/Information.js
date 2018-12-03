import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Avatar, Menu, Dropdown, Form  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import {getPageQuery} from '../../../../utils/utils';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@Form.create()
class RegInformation extends Component {    
        constructor(props){
          super(props);
          this.state={
              PersonId:props.search.RegId,
              detailData:[]
          }
      }
      componentDidMount(){
          const {dispatch}=this.props;
          const {PersonId}=this.state;
          dispatch({
              type:"eventManage/EventAttendeeRegisterDetail",
              payload:{Id:PersonId},
              callback:data=>{
                  data={
                      ...data,
                      RegisterDate:moment(data.RegisterDate).format('YYYY-MM-DD'),
                      TicketType:data.TicketType=="1006001" ?'个人':'团体',
                      PaymentStatus:data.PaymentStatus=="1002"?'已支付':"未支付",
                  }
                  this.setState({detailData:data})
              }
          })
      }   
      render() {
          const {detailData}=this.state;
          let totalAmount=0;
          const childAttdeeData=(detailData.ChildAttendees!=undefined)?detailData.ChildAttendees.map(element=>{
           return <div  className={styles.companyDet} key={element.Id}>
                <div className={styles.avtDiv}>
                    <Avatar icon="user" />
                    <span>{element.FirstName+element.LastName}</span>
                </div>
                <div className={styles.contentDiv}>
                <div><Icon type="user" theme="outlined" />{element.CompanyName}</div>
                    <div><Icon type="phone" theme="outlined" />{element.PhoneNumber}</div>
                    <div><Icon type="mail" theme="outlined" />{element.Email}</div>
                </div>
            </div>
          }):'';
          const PaymentList=(detailData.PaymentList!=undefined)?detailData.PaymentList.map(element=>{
            totalAmount+=element.OrderAmount;
            return <Col span={24} style={{marginBottom:20}}>
                            <Col span={18}>{element.OrderName}</Col>
                            <Col span={6} style={{textAlign:"right"}}><span style={{color:'red'}}>{element.OrderAmount}</span>(优惠后)</Col>
                    </Col>
           }):'';
          const mainAttdeeData=(detailData.MainAttendee!=undefined)?(
            <div  className={styles.companyDet} key={detailData.MainAttendee.Id}>
                 <div className={styles.avtDiv}>
                     <Avatar icon="user" />
                     <span>{detailData.MainAttendee.FirstName+detailData.MainAttendee.LastName}</span>
                 </div>
                 <div className={styles.contentDiv}>
                 <div><Icon type="user" theme="outlined" />{detailData.MainAttendee.CompanyName}</div>
                     <div><Icon type="phone" theme="outlined" />{detailData.MainAttendee.PhoneNumber}</div>
                     <div><Icon type="mail" theme="outlined" />{detailData.MainAttendee.Email}</div>
                 </div>
             </div>
          ):'';
           const Contactor=(detailData.Contactor!=undefined )?(
            <div  className={styles.companyDet} key={detailData.Contactor.Id}>
                 <div className={styles.avtDiv}>
                     <Avatar icon="user" />
                     <span>{detailData.Contactor.FirstName+detailData.Contactor.LastName}</span>
                 </div>
                 <div className={styles.contentDiv}>
                 <div><Icon type="user" theme="outlined" />{detailData.Contactor.CompanyName}</div>
                     <div><Icon type="phone" theme="outlined" />{detailData.Contactor.PhoneNumber}</div>
                     <div><Icon type="mail" theme="outlined" />{detailData.Contactor.Email}</div>
                 </div>
             </div>
           ):'';
          return ( 
            <div className={styles.main}>
                <Row gutter={24} style={{margin:30,background:'#fff'}}>
                    <Col span={12} style={{padding:30}}>
                        <Col span={12}>注册ID：{detailData.SerialNumber}</Col>
                        <Col span={12}>注册日期：{detailData.RegisterDate}</Col>
                        <Col span={24}>
                            {mainAttdeeData}
                         </Col>
                         <Col span={24}>
                                <div  className={styles.blues}>参会陪同者</div>
                                {childAttdeeData}
                            </Col>
                            <Col span={24}>
                                <div  className={styles.blues}>参会联系人</div>
                                {Contactor}
                            </Col>
                    </Col>
                    <Col span={12} style={{padding:30}}>
                         <Col span={24}>
                                <div  className={styles.blues}>门票信息</div>
                                <div className={styles.companyDetails}>
                                    <div>门票名称：<span>{detailData.TicketName}</span></div>
                                    <div>门票类型：<span>{detailData.TicketType}</span></div>
                                    <div>优惠类型：<span>{detailData.DiscountType}</span></div>
                                    <div>金额：<span>{detailData.Amount}</span></div>
                                    <div>付款状态：<span>{detailData.PaymentStatus}</span></div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className={styles.blues}>付款订单</div>
                                {totalAmount>0?
                                <Col span={24} className={styles.orderDiv}>
                                    {PaymentList}
                                    <Col span={24} style={{marginBottom:20,textAlign:'right'}}>
                                         合计：{totalAmount}
                                         {/* 付款人：{detailData.Payer} */}
                                    </Col>
                                 </Col>:""
                                }
                            </Col>
                    </Col>
                
                </Row>
            </div>
           )
      }
}
export default connect(({eventManage = {}, loading }) => ({
}))(injectIntl(RegInformation));