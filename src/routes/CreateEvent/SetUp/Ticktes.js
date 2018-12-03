import React, { Component } from 'react';
import { Row,Col,Form, Input, DatePicker, Select,Checkbox,Radio ,Button,message,Icon,Modal } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../utils/utils';
import styles from './ticket.less';
import TicketList from '../SetUp/TicketComponent/TicketList';
import DiscountList from '../SetUp/TicketComponent/DiscountList';
import ticket3 from '../../../assets/ticket3.png';
import { promises } from 'fs';
import { resolve } from 'path';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;


@Form.create()
class Tickets extends Component{
    constructor(props){
        super(props);
        this.state={
            visible: false,
            eventid:getPageQuery(props.location.search).id,
            isNumberChecked:false,
            confirmLoading:false,
            blankHidden:true,
            EditModalState:false,
            EditTicketDetail:[],
            TicketListDate:[],
            TicketId:'',
            BankMessage:{
                BankName:'',
                Name:'',
                BankNumber:''
            },
            BankDetail:[]
        }
    }
    componentWillReceiveProps(nextProps){
        let ishidden=(nextProps.ticketListDate.length==0 && nextProps.discountList.length==0)
        // if(!ishidden){
            this.setState({
                TicketListDate:nextProps.ticketListDate,
                blankHidden:!ishidden?false:true
            })
        // }
    }
    componentWillMount(){
        const  {dispatch } = this.props;
        dispatch({
            type:'event/EventTicketList',
            payload:{'EventId':this.state.eventid}
        })
        dispatch({
            type:'event/AllCurrency',
        })
        dispatch({
            type:'event/DeloitteEntityBankAccount',
        })
        dispatch({
            type:'event/EventDiscountList',
            payload:{'EventId':this.state.eventid}
        })
        dispatch({
            type:'event/EventBankAccountDetail',
            payload:{'EventId':this.state.eventid},
            callback:(data)=>{
                if(data.length!=0){
                    this.setState({
                        BankDetail:data,
                        BankMessage:{
                            BankName:data.BankName,
                            Name:data.Description,
                            BankNumber: data.AccountNumber != null ? data.AccountNumber+' ('+data.Currency+")" : ""
                        }
                    })
                }
            }
        })
    }
   showModal = () => {
    this.setState({
        visible:true,
        EditModalState:false
    })

   }
   handleOk = (e) => {
    const {dispatch}=this.props;  
    this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
            return;
        }
        this.setState({confirmLoading:true});
        let values;
        if(this.state.EditModalState){
            values={
                ...fieldsValue,
                EventId:this.state.eventid,
                Id:this.state.EditTicketDetail.Id
            }
            dispatch({
                type:'event/EventTicketEdit',
                payload:values,
                callback:(data)=>{
                    data?this.setState({confirmLoading:false,EditModalState:false,EditTicketDetail:[],blankHidden:true,visible:false}):null;
                    dispatch({
                        type:'event/EventTicketList',
                        payload:{'EventId':this.state.eventid}
                    })
                }
            })
        }else{
            values={
                ...fieldsValue,
                EventId:this.state.eventid
            }
            dispatch({
                type:'event/EventTicketAddition',
                payload:values,
                callback:(data)=>{
                    data?this.setState({confirmLoading:false,EditModalState:false,EditTicketDetail:[],blankHidden:true,visible:false}):null;
                    dispatch({
                        type:'event/EventTicketList',
                        payload:{'EventId':this.state.eventid}
                    })
                }
            })
        }
    })
   }
 
   handleCancel = (e) => {
    this.setState({
      visible: false,
      EditModalState:false
    });
   }
   RadioChange= (e) => {
    this.setState({
        isNumberChecked:e.target.checked
    })
   }
   TicketEdit = (data) =>{
    if(data.OneRegistantTicketLimit){
        this.setState({
            isNumberChecked:true
        })
    }
     var tDate=data;
     this.setState({
        EditTicketDetail:tDate,
        visible:true,
        EditModalState:true
    })
   }
   DeleteTicket = (data) =>{
    const {dispatch,intl}=this.props;
    const {eventid}=this.state;
    confirm({
        title:intl.formatMessage({id:'event.message.deleteSure'}),
        okText:intl.formatMessage({id:'event.Confirm'}),
        cancelText:intl.formatMessage({id:'event.Cancel'}),
        onOk() {
            let values={
                EventId:eventid,
                Id:data.Id
            }
            dispatch({
                type:'event/EventTicketDelete',
                payload:values,
                callback:(element)=>{
                    element?
                    dispatch({
                        type:'event/EventTicketList',
                        payload:{'EventId':eventid}
                    }):message.success(intl.formatMessage({id:'event.message.deletefailed'}));
                    }
                })
        },
        
        onCancel() {},
      });
    }
    BankChange=(value)=>{
        const {BankList,dispatch}=this.props;
        dispatch({
            type:'event/EventBankAccountEdit',
            payload:{
                EventId:this.state.eventid,
                BankAccountId:value
            },
            callback:(data)=>{

            } 
        })
       
        BankList.map((event)=>{
            if(event.Id==value){
                this.setState({
                    BankDetail:event,
                    BankMessage:{
                        BankName:event.BankName,
                        Name:event.Description,
                        BankNumber:event.AccountNumber != null ? event.AccountNumber+'('+event.Currency+")" : ""
                    }
                })
            }
        })
    }
    OnlyShowNumber=(value)=>{
        return new RegExp(/^[0-9]*$/).test(value)?value:''
    }
    render(){
        const {confirmLoading,blankHidden,EditModalState,EditTicketDetail,BankMessage,BankDetail}=this.state;
        const { getFieldDecorator } = this.props.form;
        const {intl,currencyList,ticketListDate,BankList}=this.props;
        const currencyListItem=currencyList!=[]?currencyList.map(event => <Option key={event} value={event.Key}>{event.Value}</Option>):'';
        const BankOption=BankList!=[]?BankList.map(event => <Option key={event.Id} value={event.Id}>{event.AccountName}</Option>):'';

        return(
            <div className={styles.main}>
                <div className={styles.Cheaders}>
                        Event
                        <div className={styles.CHRight}>
                        {intl.formatMessage({id:'event.menu.Tickets & Coupons'})}
                        </div>
                </div>
                <div className={styles.content}>
                <div className={styles.payments}>
                    <div style={{width:'60%'}}>
                    <h1 style={{fontWeight:'normal'}}>{intl.formatMessage({id:'event.ticket.collectionAccount'})}</h1>
                    <Form>
                    <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.selectAccount'})}>
                              
                    {getFieldDecorator('ExternalContactor', {
                            initialValue:BankDetail != [] && BankDetail.Id != '00000000-0000-0000-0000-000000000000' ? BankDetail.Id + '' : '',
                           })(
                              <Select placeholder='' onChange={this.BankChange}>
                                {BankOption}
                               </Select>
                           )}
                     </FormItem>
                    </Form>
                     <div>
                         <span>{intl.formatMessage({id:'event.ticket.bankname'})}：{BankMessage.BankName}</span><br/>
                         <span>{intl.formatMessage({id:'event.ticket.name'})}：{BankMessage.Name}</span><br/>
                         <span>{intl.formatMessage({id:'event.ticket.bankNumber'})}：{BankMessage.BankNumber}</span>                         
                     </div>
                    </div>
                     
                </div>
                {blankHidden?(
                <div className={styles.blankFDiv}>
                <div className={styles.blankDiv}>
                        <Row gutter={24}>
                            <Col span={11} style={{textAlign:'right'}}>
                                <img src={ticket3}/>
                            </Col>
                            <Col span={12}>
                                <h1>{intl.formatMessage({id:'event.ticket.noTicket'})}</h1>
                                <span>{intl.formatMessage({id:'event.ticket.noTicketDes'})}</span>
                                <Button type='primary' style={{display:'block',marginTop:20}} onClick={this.showModal}>
                                    <Icon type="plus" />{intl.formatMessage({id:'event.ticket.createTicket'})}
                                </Button>
                            </Col>
                        </Row>    
                        </div>
                </div>):(
                    <Row gutter={24}>
                        <Col span={12}>
                            {<TicketList DeleteTicket={this.DeleteTicket.bind(this)} TicketEdit={this.TicketEdit.bind(this)}  TicketShowModel={this.showModal.bind(this)}  TicketListDate={ticketListDate} />}
                        </Col>
                        <Col span={12}>
                            {<DiscountList eventId={this.state.eventid}/>}
                        </Col>
                    </Row>
                )}
                    <Modal
                        title={EditModalState?intl.formatMessage({id:'event.ticket.EditTitle'}):intl.formatMessage({id:'event.ticket.createTicket'})}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        width={800}
                        destroyOnClose>
                        <Form className={styles.selectMain}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.ticketName'})}>
                                {getFieldDecorator('TicketName', {
                                    initialValue:EditModalState?EditTicketDetail.Name:undefined,
                                    rules: [{ required: true, message: intl.formatMessage({id:'event.ticket.messageTN'})}],
                                })(  
                                    <Input />
                                )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.priceType'})}>
                                {getFieldDecorator('PriceType', {
                                    initialValue:EditModalState?EditTicketDetail.PriceType+"":undefined,
                                    rules: [{ required: true, message:intl.formatMessage({id:'event.ticket.messageTN'}) }],
                                })(  
                                    <Select placeholder=''>
                                        <Option value="1007001">{intl.formatMessage({id:'event.ticket.priceTypeStandard'})}</Option>
                                        <Option value="1007002">{intl.formatMessage({id:'event.ticket.priceTypeFree'})}</Option>
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.ticketAva'})}>
                                {getFieldDecorator('Capacity', {
                                    initialValue:EditModalState?EditTicketDetail.Capacity:undefined,
                                    normalize:this.OnlyShowNumber
                                })(  
                                    <Input/>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.currency'})}>
                                {getFieldDecorator('Currency', {
                                    initialValue:EditModalState?EditTicketDetail.Currency:"RMB",
                                })(  
                                    <Select placeholder='' initialValue='RMB'>
                                            {currencyListItem}
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.price'})}>
                                {getFieldDecorator('Price', {
                                    initialValue:EditModalState?EditTicketDetail.Price:undefined,
                                    normalize:this.OnlyShowNumber,
                                    rules: [{ required: true, message: intl.formatMessage({id:'event.ticket.messagePrice'}) }],
                                })(  
                                    <Input/>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                {getFieldDecorator('OneRegistantTicketLimit', {
                                    valuePropName: 'checked',
                                    initialValue:EditModalState?EditTicketDetail.OneRegistantTicketLimit:false
                                })(  
                                    <Checkbox onChange={this.RadioChange}>{intl.formatMessage({id:'event.ticket.purchase'})}</Checkbox>
                                )}
                                </FormItem>
                                {this.state.isNumberChecked?
                                <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.ticket.limitNumber'})}>
                                {getFieldDecorator('OneRegistantTicket', {
                                initialValue:EditModalState?EditTicketDetail.OneRegistantTicket:undefined
                                    })(  
                                    <Input/>
                                )}
                                </FormItem>
                                :null}
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
            </div>
            
        )
    }
    
}

export default connect(({event = {}, loading }) => ({
    ticketListDate:event.ticketListDate,
    currencyList:event.currencyList,
    IsTicketAdd:event.IsTicketAdd,
    discountList:event.discountList,
    BankList:event.BankList
  }))(injectIntl(Tickets));