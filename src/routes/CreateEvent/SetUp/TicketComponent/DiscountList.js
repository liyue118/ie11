import React, { Component } from 'react';
import { Row,Col,Form, Input, DatePicker, Select,Checkbox,Radio ,message,Card,Icon,Modal,InputNumber} from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import moment from 'moment';
import ticket2 from '../../../../assets/ticket2.png';
import styles from './styles.less';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const confirm = Modal.confirm;
@Form.create()
class DiscountList extends Component{
    constructor(props){
        super(props);
        this.state={
            M1Disable:false,
            isNumberChecked:false,
            eventid:props.eventId,
            confirmLoading:false,
            EditDisount:false,
            DiscountDetail:[],
            ticketPrice:1,
            Currency:'RMB',
        }
    }
    componentWillMount(){
        // const  {dispatch } = this.props;
        // dispatch({
        //     type:'event/EventDiscountList',
        //     payload:{'EventId':this.state.eventid}
        // })
    }
    showModal = () => {
        const {ticketListDate}=this.props;
        if(ticketListDate.length>0){
            ticketListDate[0].PriceType=="1007001"?
                this.setState({
                M1Disable: true, EditDisount:false,ticketPrice:ticketListDate[0].Price,Currency:ticketListDate[0].Currency
            }):message.success("免费门票不需要新建优惠");
        }else{
            message.success("请先创建门票");
        }
    }
    
    handleOk = (e) => {
        const  {dispatch } = this.props;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.setState({confirmLoading:true});
            if(fieldsValue.IsDiscountDateLimit==false)delete fieldsValue['IsDiscountDateLimit'];
            let values={};
            if(fieldsValue['StartDate']!=undefined || fieldsValue['EndDate']!=undefined ){
                values={
                    'StartDate': fieldsValue['StartDate'].format('YYYY-MM-DD'),
                    'EndDate': fieldsValue['EndDate'].format('YYYY-MM-DD'),
                }
            }
            if(!this.state.EditDisount){
                values={
                    ...fieldsValue,
                    ...values,
                    EventId:this.state.eventid,
                }
                dispatch({
                    type:'event/EventDiscountAddition',
                    payload:values,
                    callback:(data)=>{
                        data?this.setState({confirmLoading:false,EditTicketDetail:[],M1Disable:false,EditDisount:false}):null;
                        dispatch({
                            type:'event/EventDiscountList',
                            payload:{'EventId':this.state.eventid}
                        })
                    }
                })
            }else{
                values={
                    ...fieldsValue,
                    ...values,
                    EventId:this.state.eventid,
                    Id:this.state.DiscountDetail.Id,
                }
                dispatch({
                    type:'event/EventDiscountEdit',
                    payload:values,
                    callback:(data)=>{
                        data?this.setState({confirmLoading:false,EditTicketDetail:[],M1Disable:false,EditDisount:false}):null;
                        dispatch({
                            type:'event/EventDiscountList',
                            payload:{'EventId':this.state.eventid}
                        })
                    }
                })
            }
        })
    }
    
    handleCancel = (e) => {
        this.setState({
          M1Disable: false,EditDisount:false,
        });
    }
    RadioChange= (e) => {
        this.setState({
            isNumberChecked:e.target.checked
        })
    }
    DiscountEdit=(data)=>{
        const {ticketListDate}=this.props;
        if(data.IsDiscountDateLimit){
            this.setState({
                isNumberChecked:true,
            })
        }
        this.setState({
            DiscountDetail:data,
            M1Disable: true,
            EditDisount:true,
            ticketPrice:ticketListDate[0].Price,
            Currency:ticketListDate[0].Currency
          });
    } 
    DiscountTicket=(data)=>{
        const {dispatch,intl}=this.props;
        const {eventid}=this.state;
        confirm({
            title:intl.formatMessage({id:'event.message.deleteSure'}),
            okText:intl.formatMessage({id:'event.Confirm'}),
            cancelText:intl.formatMessage({id:'event.Cancel'}),
            onOk() {
                let values={
                    EventId:data.EventId,
                    Id:data.Id
                }
                dispatch({
                    type:'event/EventDiscountDelete',
                    payload:values,
                    callback:(element)=>{
                        element?
                        dispatch({
                            type:'event/EventDiscountList',
                            payload:{'EventId':data.EventId}
                        }):message.success(intl.formatMessage({id:'event.message.deletefailed'}));
                    }
                })
            },
            
            onCancel() {},
          });
            
    } 
    fromDateSelect = (rule, fromMoment, callback) => {
        const form = this.props.form;
        const toMoment = form.getFieldValue('EndDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
          return callback()
        }
    
        if (toMoment.isBefore(fromMoment, 'day')) {
          return callback(this.props.intl.formatMessage({id:'event.g.timeFrom'}))
        }
        form.validateFields(['EndDate'],(err, fieldsValue) => {
            form.setFieldsValue(fieldsValue);
        })
        return callback()
    }

    toDateSelect = (rule, toMoment, callback) => {
        const form = this.props.form;
        const fromMoment = form.getFieldValue('StartDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
            return callback()
        }

        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeTo'}))
        }
        form.validateFields(['StartDate'],(err, fieldsValue) => {
            form.setFieldsValue(fieldsValue);
        })
        return callback()
    }
    disabledDate=(current)=>{
        return current && current < moment().endOf('day');
    }
    render(){
        const {intl,discountList} =this.props;
        const { getFieldDecorator } = this.props.form;
        const {confirmLoading,DiscountDetail,EditDisount}=this.state;
        const dateFormat = 'YYYY-MM-DD';
        const listItem=discountList!=[]?(discountList.map(event=>
            <li key={event.Id}>
                <div className={`${styles.TicketComTitle} ${styles.green}`}>
                    <span>{event.DiscountName}</span>
                        <div className={styles.TRight}>
                            <Icon type="edit" theme="outlined" onClick={this.DiscountEdit.bind(this,event)} />
                            <Icon type="close" theme="outlined" onClick={this.DiscountTicket.bind(this,event)}  />
                        </div>
                </div> 
                <div  className={`${styles.TicketAount} ${styles.green}`}>
                    <span style={{textAlign:'center'}}><h1 style={{color:'#fff',lineHeight:'63px'}}>-{event.DiscountAmount+this.state.Currency}</h1></span>
                </div> 
            </li>
        )):'';
        return(
            <div className={styles.main}>
                    <h3>{intl.formatMessage({id:'Promotion'})}</h3>
                  <ul>
                    {listItem}
                  </ul>
                   <div className={`${styles.TicketAddDiv} ${styles.green}`}  onClick={this.showModal} style={{background:'#fff',borderColor:'#59c34b'}}>
                        <img src={ticket2}/>
                        <a className={styles.addIcon}  href="javascript:void(0)"  style={{color:'#59c34b'}}><Icon type="plus"  />{intl.formatMessage({id:'event.ticket.discount'})}</a>
                   </div> 
                   <Modal
                title={!this.state.EditDisount?intl.formatMessage({id:'event.ticket.discount'}):intl.formatMessage({id:'event.ticket.Editdiscount'})}
                visible={this.state.M1Disable}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                width={830}
                destroyOnClose
              >
                <Form className={styles.selectMain}>
                                    <Row gutter={24}>
                                            <Col span={12}>
                                            <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.discountname'})}>
                                            {getFieldDecorator('DiscountName', {
                                                initialValue:EditDisount?DiscountDetail.DiscountName:'',
                                                rules: [{ required: true, message: intl.formatMessage({id:'event.ticket.messageDN'}) }],
                                                })(  
                                                <Input/>
                                            )}
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                            <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.discountPer'})}>
                                            {getFieldDecorator('DiscountAmount', {
                                                initialValue:EditDisount?DiscountDetail.DiscountAmount:'',
                                                rules: [{ required: true,message:intl.formatMessage({id:'event.ticket.messageDR'})},
                                                ],
                                                })(  
                                            <InputNumber  max={this.state.ticketPrice} min={0} style={{width:'100%'}}/>
                                             )}
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                             <FormItem>
                                             {getFieldDecorator('IsDiscountDateLimit', {
                                                    valuePropName: 'checked',
                                                    initialValue:EditDisount?DiscountDetail.IsDiscountDateLimit:false,
                                                })(  
                                                    <Checkbox onChange={this.RadioChange}>{intl.formatMessage({id:'event.ticket.limitDate'})}</Checkbox>
                                                )}
                                                </FormItem>
                                            </Col>
                                            {this.state.isNumberChecked?
                                            <Col span={24}>
                                                 <Col span={12} style={{paddingRight:12}}>
                                                    <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startDate'})} >
                                                    {getFieldDecorator('StartDate', {
                                                          initialValue:EditDisount?(DiscountDetail.StartDate!=null?moment(DiscountDetail.StartDate,dateFormat):undefined):undefined,
                                                          rules:[{ validator: this.fromDateSelect}],
                                                        })(
                                                    <DatePicker format={dateFormat}  placeholder='' style={{width:'100%'}} disabledDate={this.disabledDate}/>
                                                        )}
                                                </FormItem>
                                                </Col>
                                                <Col span={12}  style={{paddingLeft:12}}>
                                                    <FormItem label={intl.formatMessage({id:'event.common.endDate'})} className={styles.fromItem}>
                                                    {getFieldDecorator('EndDate', {
                                                            initialValue:EditDisount?(DiscountDetail.EndDate!=null?moment(DiscountDetail.EndDate,dateFormat):undefined):undefined,
                                                            rules:[{ validator: this.toDateSelect}],
                                                        })(
                                                    <DatePicker format={dateFormat} placeholder='' style={{width:'100%'}} disabledDate={this.disabledDate}/>
                                                )}
                                                    </FormItem>
                                                </Col>
                                            </Col>
                                            :null}
                                    </Row>
                                    </Form>
              </Modal>
            </div>
            
        )
    }
    
}

export default connect(({event = {}, loading }) => ({
    discountList:event.discountList,
    ticketListDate:event.ticketListDate,
  }))(injectIntl(DiscountList));