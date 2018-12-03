import React, { Component } from 'react';
import { Row, Col, Icon, Table, Select, Button, Input, Modal, Tabs, Menu, Dropdown, Form, Spin, message  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../../utils/utils';
import RegInformation from './Information';
import ModalInvoice from '../../../../components/ModalInvoice'
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

@Form.create()
class Attendee extends Component {    
        constructor(props){
          super(props);
          const {intl}=props
          this.ActionsMenuData=[{key:'CheckTheReg',name:intl.formatMessage({id:'event.manage.CheckTheReg'})},
          // {key:'Checktheregistration',name:intl.formatMessage({id:'event.manage.Checktheregistration'})},
          {key:'Edit',name:intl.formatMessage({id:'event.manage.Edit'})},
          {key:'CheckStatus',name:intl.formatMessage({id:'event.manage.checkIn'})},
          {key:'PaymentStatus',name:intl.formatMessage({id:'event.manage.ChangePayment'})},
          {key:'invoice',name:intl.formatMessage({id:'event.manage.RequireInvoice'})},
          {key:'CancelTheTicket',name:intl.formatMessage({id:'event.manage.CancelTheTicket'})}
          ]
          this.state={
              isChecked:false,
              M1Disable:false,
              isChoose:false,
              isShowInformation:false,
              ContactDate:[],
              ContactValue:[],
              confirmLoading:false,
              AttendeeFilter:'',
              DiscountId:'',
              PaymentStatus:'',
              CheckStatusType:'',
              AttendeeId:'',
              NewAttendeeDate:[],
              disabled:false,
              EditDisabled:false,
              GerAttendeeData:[],
              isShowBatch:false,
              BatchName:"Batchcheckin",
              currentData:{},
              spinning:false,
              isEditAttendee:false,
              checkAttendeeId:[], //参与者Id Arr 用来判断添加参与者时是否存在当前参与者
              ModalDiscount:false,
              selectedRows:[],
              isCancelAttedee:false
          }
      }
      componentDidMount(){
        const  {dispatch,eventId,intl,isFull,eventStatus} = this.props;
        this.props.onRef(this);
        if(eventStatus=='1009001' || isFull){
          this.setState({isChoose:true});
        }
        this.setState({ //调用获取参与者接口时打开loading
          spinning:true
        })
        dispatch({
          type:'eventManage/EventDiscountList',
          payload:{EventId:eventId}
      })
        dispatch({
          type:'eventManage/ContactAllList',
          payload:{Filter:""},
          callback:(data)=>{
            data.Contacts!=null?this.setState({ContactDate:data.Contacts}):'';
          }
        })
      }   
      onRefresh=()=>{
        const  {dispatch,eventId} = this.props;
        this.setState({spinning: true})
        dispatch({
          type:'eventManage/EventAttendeeListByFilter',
          payload:{
          EventId:eventId,
          AttendeeFilter:this.state.AttendeeFilter,
          DiscountId:this.state.DiscountId,
          PaymentStatus:this.state.PaymentStatus,
          CheckStatusType:this.state.CheckStatusType
        },
        callback: (data, arr)=>{
          this.setState({ //回掉中关闭loading
            spinning: false,
            checkAttendeeId: arr,
          })
        }
      })
      }
      showModal = (data) => {
        if(data==="Add"){
          this.setState({ isEditAttendee: false });  //点击新增参与者按钮之后修改状态
        }else if(data==='Edit'){
          this.setState({ isEditAttendee: true });  //点击编辑参与者按钮之后修改状态
        }
        this.setState({
            M1Disable: true,
            NewAttendeeDate:[]
          });
      }
        
        
      handleCancel = (e) => {
            this.setState({
              M1Disable: false,
              confirmLoading:false
            });
          }
      MemberListChange=(value)=>{
            console.log(`Selected: ${value}`);
          }
      MenuClick=(key)=>{  //列表Action操作
        const {dispatch,eventId,intl,eventStatus}=this.props;
        const { 
          GerAttendeeData, 
          currentData,
          AttendeeFilter,
          DiscountId,
          PaymentStatus,
          CheckStatusType
        }=this.state;
        key=key.key;
        if(key=='CheckTheReg'){
              window.open("/#/createEvent/manage/registration?RegId="+GerAttendeeData.Id+"&id="+eventId+"&eventstatus="+eventStatus)
        }else if(key=="Edit"){
            this.setState({spinning:true})
            dispatch({
              type:'eventManage/EventAttendeeDetail',
              payload:{AttendeeId:GerAttendeeData.AttendeeId,EventId:eventId},
              callback:data=>{
                this.showModal('Edit');
                this.setState({NewAttendeeDate:data,spinning:false})
              }
            })
        }else if(key=="CheckStatus"){
          this.setState({ //调用获取参与者接口时打开loading
            spinning: true
          })
          dispatch({
            type:'eventManage/EventAttendeeCheck',
            payload:{AttendeeId:GerAttendeeData.AttendeeId,EventId:eventId},
            callback:data=>{
              dispatch({
                type: 'eventManage/EventAttendeeListByFilter',
                payload: {
                  EventId: eventId,
                  AttendeeFilter: AttendeeFilter,
                  DiscountId: DiscountId,
                  PaymentStatus: PaymentStatus,
                  CheckStatusType: CheckStatusType
                },
                callback: (data) => {
                  this.setState({ //回掉中关闭loading
                    spinning: false
                  })
                }
              })
            }
          })
        }else if(key=="PaymentStatus"){
          this.setState({ //调用获取参与者接口时打开loading
            spinning: true
          })
          dispatch({
            type:'eventManage/EventAttendeePaymentUpdate',
            payload:{EventAttendee:GerAttendeeData.AttendeeId,EventId:eventId,PaymentStatus:GerAttendeeData.PaymentStatus=="1001"?"1002":"1001"},
            callback:data=>{
              dispatch({
                type: 'eventManage/EventAttendeeListByFilter',
                payload: {
                  EventId: eventId,
                  AttendeeFilter: AttendeeFilter,
                  DiscountId: DiscountId,
                  PaymentStatus: PaymentStatus,
                  CheckStatusType: CheckStatusType
                },
                callback: (data) => {
                  this.setState({ //回掉中关闭loading
                    spinning: false
                  })
                }
              })
            }
          })
        }else if (key == "CancelTheTicket" && !!currentData && !!currentData.EventId && !!currentData.AttendeeId){
          let _self=this;
          confirm({
            title: intl.formatMessage({id:'event.message.cancelTicket'}),
            content: '',
            okText: intl.formatMessage({id:'event.Confirm'}),
            okType: 'danger',
            cancelText: intl.formatMessage({id:'event.Cancel'}),
            onOk() {
              _self.setState({ //调用获取参与者接口时打开loading
                spinning: true
              })
              dispatch({
                type: 'eventManage/EventAttendeeCancelUpdate',
                payload: { 
                  EventId: eventId, 
                  EventAttendee: GerAttendeeData.AttendeeId 
                },
                callback: data => {
                  // message.success(intl.formatMessage({id:'event.message.delete'}));
                  dispatch({
                    type: 'eventManage/EventAttendeeListByFilter',
                    payload: {
                      EventId:eventId,
                      AttendeeFilter: AttendeeFilter,
                      DiscountId: DiscountId,
                      PaymentStatus: PaymentStatus,
                      CheckStatusType: CheckStatusType
                    },
                    callback: (data, arr) => {
                      _self.setState({ //回掉中关闭loading
                        spinning: false,
                        checkAttendeeId: arr,
                      })
                    }
                  })
                }
              })
            },
            onCancel() {},
          });
        }else if(key=="invoice"){
          this.setState({spinning:true})
          this.ModalInvoice.showModal(currentData);
        }else if(key=='RecoverTicket'){
          this.setState({spinning:true})
          dispatch({
            type:'eventManage/EventAttendeeRecoverUpdate',
            payload:{EventAttendee:GerAttendeeData.AttendeeId,EventId:eventId},
            callback:data=>{
             if(data.ReturnCode=='1001'){
                dispatch({
                  type: 'eventManage/EventAttendeeListByFilter',
                  payload: {
                    EventId: eventId,
                    AttendeeFilter: AttendeeFilter,
                    DiscountId: DiscountId,
                    PaymentStatus: PaymentStatus,
                    CheckStatusType: CheckStatusType
                  },
                  callback: (data) => {
                    this.setState({ //回掉中关闭loading
                      spinning: false
                    })
                  }
                })
             }
            }
          })
        }
      }
      //添加参与者    
      AddAttendee=(value)=>{
        const  {dispatch,eventId} = this.props;
        const { AttendeeFilter, DiscountId, PaymentStatus, CheckStatusType,isEditAttendee,currentData}=this.state;
        this.props.form.validateFields((err, fieldsValue) => {
          if(err.CompanyName!=undefined||
             err.DiscountId!=undefined||
             err.EmailAddress!=undefined||
             err.FirstName!=undefined||
             err.JobTitle!=undefined||
             err.LastName!=undefined||
             err.PaymentType!=undefined||
             err.Telephone!=undefined){
            return
          }
         
          this.setState({confirmLoading:true})
          let values={
            ...fieldsValue,
            AttendeeId:fieldsValue.AttendeeId!=undefined?fieldsValue.AttendeeId:'',
            EventId:eventId,
            
          }
          let type='';
          if(isEditAttendee){
            type="eventManage/EventAttendeeEdit";
            delete values['EventId'];
            values={
              ...values,
              AttendeeId:currentData.AttendeeId,
              Id:currentData.Id
            }
          }else{
            type="eventManage/EventAttendeeAddition";
            
          }
          dispatch({
            type:type,
            payload:values,
            callback:data=>{
              this.setState({ confirmLoading: false, M1Disable: false, spinning: true});
              dispatch({
                type: 'eventManage/EventAttendeeListByFilter',
                payload: {
                  EventId: eventId,
                  AttendeeFilter: AttendeeFilter,
                  DiscountId: DiscountId,
                  PaymentStatus: PaymentStatus,
                  CheckStatusType: CheckStatusType
                },
                callback: (data, arr) => {
                  this.setState({ //回掉中关闭loading
                    spinning: false,
                    checkAttendeeId: arr,
                  })
                }
              })
            }
          })
        })
      }
      //搜索用户
      fetchContact=(value)=>{
        const  {dispatch,eventId} = this.props;
        // if(value.length){
          dispatch({
            type:'eventManage/ContactAllList',
            payload:{Filter:"",QueryClause:value},
            callback:(data)=>{
              data.Contacts!=null?this.setState({ContactDate:data.Contacts}):'';
            }
          })
        // }
      }
      ContactChange=(value)=>{
        const { checkAttendeeId, ContactDate} = this.state;
        let showData = true;
        if(!!checkAttendeeId && checkAttendeeId.length){
          checkAttendeeId.map((item,index)=>{
            if(item===value){
              message.error(this.props.intl.formatMessage({id:'event.message.DNRePar'}));
              showData = false;
            }
          })
        }
        if(showData){
          ContactDate.forEach(element => {
            if (value == element.PersonId) {
              this.setState({ NewAttendeeDate: element });
              return;
            }
          })
        }
      }
      selectChange=(status,value)=>{
        const {dispatch,eventId}=this.props;
        switch(status){
          case "AttendeeFilter":
              value=='1003006'?this.setState({isCancelAttedee:true}):this.setState({isCancelAttedee:false});
              this.setState({AttendeeFilter:value})
          break;
          case "DiscountId":
              this.setState({DiscountId:value})
          break;
          case "PaymentStatus":
              this.setState({PaymentStatus:value})
          break;
          case "CheckStatusType":
              this.setState({CheckStatusType:value})
          break;
        }
        setTimeout(() => {
            this.setState({ spinning: true })
            dispatch({
              type:'eventManage/EventAttendeeListByFilter',
              payload:{
              EventId:eventId,
              AttendeeFilter:this.state.AttendeeFilter,
              DiscountId:this.state.DiscountId,
              PaymentStatus:this.state.PaymentStatus,
              CheckStatusType:this.state.CheckStatusType
              },
              callback: (data, arr) => {
                this.setState({ //回掉中关闭loading
                  spinning: false,
                  checkAttendeeId: arr,
                })
              }
            })
        }, 50);

      }

 
      createMenu=()=>{
        const {GerAttendeeData,currentData}=this.state;
        const {intl}=this.props;
        console.log(currentData.InvoiceStatus);
        return this.ActionsMenuData.map(data=>{
            if(data.key=="CheckStatus" && GerAttendeeData.CheckStatus=="1002"){
              return;
            }else if(data.key=="invoice"){
              if(GerAttendeeData.PaymentStatus=="1002" && currentData.InvoiceStatus=="1013001"){
                return (<Menu.Item key={data.key}>{data.name}</Menu.Item>)
              }else{
                return
              }
            }else if(data.key=='CancelTheTicket' && (GerAttendeeData.PaymentStatus=="1002")){
              return
            }else if(data.key=="PaymentStatus"){
              if(GerAttendeeData.PaymentStatus=="1002" && !(currentData.InvoiceStatus=="1013001")){
                return
              }
              return  (<Menu.Item key={data.key}>{data.name}</Menu.Item>)
            }else{
              return (<Menu.Item key={data.key}>{data.name}</Menu.Item>)
            }
        })    
      }
      setAttendeeData=(value,record)=>{
        this.setState({ GerAttendeeData: value, currentData: record});
      }
      BatchCheck=()=>{
        const {dispatch,eventId}=this.props;
        const {
          AttendeeFilter,
          DiscountId,
          PaymentStatus,
          CheckStatusType
        }=this.state;
        this.setState({ spinning: true })
        dispatch({
          type:'eventManage/EventAttendeeBatchCheck',
            payload:{Attendees:this.state.selectedRowKeys,EventId:eventId},
            callback:data=>{
              dispatch({
                type: 'eventManage/EventAttendeeListByFilter',
                payload: {
                  EventId: eventId,
                  AttendeeFilter: AttendeeFilter,
                  DiscountId: DiscountId,
                  PaymentStatus: PaymentStatus,
                  CheckStatusType: CheckStatusType
                },
                callback: (data) => {
                  this.setState({ //回掉中关闭loading
                    spinning: false
                  })
                }
              })
            }
        })
      }
      BatchMenuClick=(key)=>{
        const {dispatch,eventId,intl}=this.props;
        const {
          AttendeeFilter,
          DiscountId,
          PaymentStatus,
          CheckStatusType,
          selectedRowKeys,
        }=this.state;
        key=key.key;
        if(key=="Batchpayment"){
          this.setState({ spinning: true })
          dispatch({
            type:'eventManage/EventAttendeePaymentBatchUpdate',
              payload:{EventAttendees:selectedRowKeys,EventId:eventId,PaymentStatus:'1002'},
              callback:data=>{
                dispatch({
                  type: 'eventManage/EventAttendeeListByFilter',
                  payload: {
                    EventId: eventId,
                    AttendeeFilter: AttendeeFilter,
                    DiscountId: DiscountId,
                    PaymentStatus: PaymentStatus,
                    CheckStatusType: CheckStatusType
                  },
                  callback: (data) => {
                    this.setState({ //回掉中关闭loading
                      spinning: false
                    })
                  }
                })
              }
          })
        }else if(key=="Bulkcancellationtheticket"){
          // this.setState({ spinning: true })
          let _self=this;
          confirm({
            title: intl.formatMessage({id:'event.message.cancelTicket'}),
            content: '',
            okText: intl.formatMessage({id:'event.Confirm'}),
            okType: 'danger',
            cancelText: intl.formatMessage({id:'event.Cancel'}),
            onOk() {
              _self.setState({ //调用获取参与者接口时打开loading
                spinning: true
              })
              dispatch({
                type: 'eventManage/EventAttendeeCancelBatchUpdate',
                payload: { 
                  EventId: eventId, 
                  EventAttendees:selectedRowKeys
                },
                callback: data => {
                  dispatch({
                    type: 'eventManage/EventAttendeeListByFilter',
                    payload: {
                      EventId: eventId,
                      AttendeeFilter: AttendeeFilter,
                      DiscountId: DiscountId,
                      PaymentStatus: PaymentStatus,
                      CheckStatusType: CheckStatusType
                    },
                    callback: (element, arr) => {
                      _self.setState({ //回掉中关闭loading
                        spinning: false,
                        checkAttendeeId: arr,
                      })
                    }
                  })
                }
              })
            },
            onCancel() {},
          });
        }else if(key=="Batchchangediscount"){
            this.setState({ModalDiscount:true})
        }else if(key=="Bulkinvoice"){
          this.setState({spinning:true})
          this.ModalInvoice.showModal(this.state.selectedRows);
        }
      }
      DiscountCancel=()=>{
        this.setState({ModalDiscount:false})
      }
      BatchDiscount=()=>{
        const {dispatch,eventId,form}=this.props;
        const {
          AttendeeFilter,
          DiscountId,
          PaymentStatus,
          CheckStatusType,
          selectedRowKeys,
        }=this.state;
        form.validateFields(['BatchDiscount'],(err, fieldsValue) => {
          if (err) {
            return;
          }
          this.setState({ //回掉中关闭loading
            spinning: true,
            ModalDiscount:false
          })
          dispatch({
            type: 'eventManage/EventAttendeeDiscountBatchUpdate',
            payload: { 
              EventId: eventId, 
              EventAttendees:selectedRowKeys,
              DiscountId:fieldsValue['BatchDiscount']
            },
            callback: data => {
              dispatch({
                type: 'eventManage/EventAttendeeListByFilter',
                payload: {
                  EventId: eventId,
                  AttendeeFilter: AttendeeFilter,
                  DiscountId: DiscountId,
                  PaymentStatus: PaymentStatus,
                  CheckStatusType: CheckStatusType
                },
                callback: (element) => {
                  this.setState({ //回掉中关闭loading
                    spinning: false
                  })
                }
              })
            }
          })
        })
      }
      onRef=(ref)=>{
        this.ModalInvoice=ref;
      }
      spinningStatus=(status)=>{
        this.setState({spinning:status})
      }
      render() {
          const {intl,DiscountList,AttendeeList,eventStatus,eventId}=this.props;
          const { getFieldDecorator } = this.props.form;
          const {
            isShowInformation,
            ContactDate,
            confirmLoading,
            NewAttendeeDate,
            disabled,
            spinning,
            isEditAttendee
          }=this.state;
          const menus=(
            !this.state.isCancelAttedee?
              <Menu onClick={this.MenuClick}>
                {this.createMenu()}
                </Menu>:
              <Menu onClick={this.MenuClick}>
                 <Menu.Item key='CheckTheReg'>{intl.formatMessage({id:'event.manage.CheckTheReg'})}</Menu.Item>
                <Menu.Item key='RecoverTicket'>{intl.formatMessage({id:'event.manage.RecoverTicket'})}</Menu.Item>
              </Menu>
          )
          const BatchMenu=(
            <Menu onClick={this.BatchMenuClick}>
                <Menu.Item key="Batchchangediscount">{intl.formatMessage({id:'event.manage.Batchchangediscount'})}</Menu.Item>
                <Menu.Item key="Batchpayment">{intl.formatMessage({id:'event.manage.Batchpayment'})}</Menu.Item>
                <Menu.Item key="Bulkinvoice">{intl.formatMessage({id:'event.manage.Mergerofmakeoutaninvoice'})}</Menu.Item>
                <Menu.Item key="Bulkcancellationtheticket">{intl.formatMessage({id:'event.manage.Bulkcancellationtheticket'})}</Menu.Item>
            </Menu>
          )
          const columns = [{
              title: intl.formatMessage({id:'event.manage.FirstName'}),
              dataIndex: 'FirstName',
              key: 'Fname',
            },{
            title: intl.formatMessage({id:'event.manage.LastName'}),
            dataIndex: 'LastName',
            key: 'Lname',
          },{
            title: intl.formatMessage({id:'event.manage.Company'}),
            dataIndex: 'CompanyName',
            key: 'company',
          },{
            title: intl.formatMessage({id:'event.manage.PaymentInstrument'}),
            dataIndex: 'PaymentType',
            key: 'PaymentInstrument',
          },{
            title: intl.formatMessage({id:'event.manage.PayStatus'}),
            dataIndex: 'PaymentStatus',
            key: 'PayStatus',
            render:(text,record)=>(
              <span style={record.PaymentStatus=="已支付"?{color:"#60b8e8"}:{}}>{record.PaymentStatus}</span>
            )
          },{
            title: intl.formatMessage({id:'event.manage.TicketType'}),
            dataIndex: 'TicketType',
            key: 'ticket',
          },{
            title: intl.formatMessage({id:'event.manage.discount'}),
            dataIndex: 'DiscountName',
            key: 'discount',
          }
          //PayAmount 
          ,{
            title: intl.formatMessage({id:'event.manage.PayAmount'}),
            dataIndex: 'PayAmount',
            key: 'PayAmount',
          }
          ,{
            title: intl.formatMessage({id:'event.manage.SignInState'}),
            dataIndex: 'CheckStatus',
            key: 'CheckStatus',
            render:(text,record)=>(
              <span style={record.CheckStatus=="已签到"?{color:"#60b8e8"}:{}}>{record.CheckStatus}</span>
            )
          },{
            title: intl.formatMessage({id:'event.manage.InvoiceStatus'}),
            dataIndex: 'InvoiceStatus',
            key: 'InvoiceStatus',
            render:(text,record)=>(
              <span style={record.CheckStatus=="1013003"?{color:"#60b8e8"}:{}}>{record.InvoiceStatus=="1013003"?'已开票':record.InvoiceStatus=="1013002"?"已申请":'未开票'}</span>
            )
          },{
            title:intl.formatMessage({id:'event.manage.RegistrationDate'}),
            dataIndex: 'RegisterDate',
            key: 'date',
          },{
            title:intl.formatMessage({id:'event.manage.Actions'}),
            dataIndex: 'action',
            render: (text, record) => (
               <div>
                <Dropdown overlay={menus} placement="bottomLeft"  trigger={['click']} onClick={this.setAttendeeData.bind(this,text,record)}>
                 <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
                </Dropdown>
               </div>
            ),
          }];

          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows});
              selectedRowKeys.length>0?this.setState({isShowBatch:true}):this.setState({isShowBatch:false})
            },
            getCheckboxProps: record => ({
              name: record.FirstName+record.LastName,
              personId:record.AttendeeId
            }),
          };
          const DiscountListDate=DiscountList!=undefined?DiscountList.map(event => <Option key={event.Id} value={event.Id}>{event.DiscountName}</Option>):'';
          return ( 
            <div>
               {isShowInformation?
                <RegInformation eventId={this.props.eventId}/>
                :
                <div>
                      <div>
                    <Button type="primary" onClick={() => { this.showModal("Add")}} style={{marginRight:10,marginLeft:10}} disabled={this.state.isChoose}>
                              {intl.formatMessage({id:'event.manage.NewParticipant'})}
                          </Button>
                          <Select defaultValue="" style={{ width: 120,marginRight:10}} onChange={this.selectChange.bind(this,"AttendeeFilter")}>
                                <Option value="">{intl.formatMessage({id:'event.manage.AllParticipator'})}</Option>
                                <Option value="1003006">{intl.formatMessage({id:'event.manage.CancelledParticipator'})}</Option>
                          </Select>
                          <Select defaultValue="" style={{ width: 120,marginRight:10 }}  onChange={this.selectChange.bind(this,"DiscountId")}>
                            <Option value="">{intl.formatMessage({id:'event.manage.AllDiscount'})}</Option>
                            {DiscountListDate}
                          </Select>
                          <Select defaultValue="" style={{ width: 140 ,marginRight:10 }}  onChange={this.selectChange.bind(this,"PaymentStatus")}> 
                            <Option value="">{intl.formatMessage({id:'event.manage.ALLPayStatus'})}</Option>
                            <Option value="1002">{intl.formatMessage({id:'event.manage.Paid'})}</Option>
                            <Option value="1001">{intl.formatMessage({id:'event.manage.Unpaid'})}</Option>
                          </Select>
                          <Select defaultValue="" style={{ width: 140 }}  onChange={this.selectChange.bind(this,"CheckStatusType")}> 
                            <Option value="">{intl.formatMessage({id:'event.manage.ALLCheckStatus'})}</Option>
                            <Option value="1002">{intl.formatMessage({id:'event.manage.Registered'})}</Option>
                            <Option value="1001">{intl.formatMessage({id:'event.manage.NotSignIn'})}</Option>
                          </Select>
                          {this.state.isShowBatch && this.state.AttendeeFilter==''?
                            <Dropdown.Button  overlay={BatchMenu}  style={{marginLeft:10 }} trigger={['click']} type='primary' onClick={this.BatchCheck}>
                            {intl.formatMessage({id:'event.manage.'+this.state.BatchName})}
                          </Dropdown.Button>
                          :null}
                      </div>
                      <ModalInvoice onRef={this.onRef} eventId={eventId} spinningStatus={this.spinningStatus.bind(this)} onRefresh={this.onRefresh}/>
                      <Modal
                      title={intl.formatMessage({ id: !isEditAttendee ? 'event.manage.NewParticipant' : 'event.manage.ModifyParticipant'})}
                      visible={this.state.M1Disable}
                      onOk={this.AddAttendee}
                      onCancel={this.handleCancel}
                      confirmLoading={confirmLoading}
                      width={800}
                      destroyOnClose
                    >
                      <Form>
                      <Row gutter={24}>
                        {!isEditAttendee
                          ?
                          <Col span={24}>
                            <FormItem label={intl.formatMessage({ id: 'event.manage.selectParticipator' })} className={styles.fromItem}>
                              {getFieldDecorator('AttendeeId', {
                                // rules: [{ required: true, message: 'Please select participator！' }],
                              })(
                                <Select
                                  showSearch
                                  style={{ width: '100%' }}
                                  filterOption={false}
                                  initialValue={ContactDate}
                                  onChange={this.ContactChange}
                                  onSearch={this.fetchContact}
                                >
                                  {ContactDate.map(d => <Option key={d.PersonId} value={d.PersonId}>{d.FirstName}{d.LastName}</Option>)}

                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          :
                          ""
                        }
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.Company'})} className={styles.fromItem}>
                                      {getFieldDecorator('CompanyName', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.CompanyName:'',
                                              rules: [{ required: true, message: intl.formatMessage({ id:'event.message.companyName' }) }]
                                  })(  
                                      <Input disabled={disabled} />
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.Position'})} className={styles.fromItem}>
                                      {getFieldDecorator('JobTitle', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.JobTitle:'',
                                              rules: [{ required: true, message: intl.formatMessage({ id:'event.message.position' }) }]
                                  })(  
                                      <Input disabled={disabled} />
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.FirstName'})} className={styles.fromItem}>
                                      {getFieldDecorator('FirstName', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.FirstName:'',
                                              rules: [{ required: true, message:intl.formatMessage({ id:'event.message.firstname' }) }]
                                  })(  
                                      <Input disabled={disabled}  />
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.LastName'})} className={styles.fromItem}>
                                      {getFieldDecorator('LastName', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.LastName:'',
                                              rules: [{ required: true, message: intl.formatMessage({ id:'event.message.lastname'}) }]
                                  })(  
                                      <Input disabled={disabled} />
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.Telephone'})} className={styles.fromItem}>
                                      {getFieldDecorator('Telephone', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.Phone:'',
                                              rules: [{ required: true, message:intl.formatMessage({ id:'event.message.phone'}) }]
                                  })(  
                                      <Input disabled={disabled} />
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.EMail'})} className={styles.fromItem}>
                                      {getFieldDecorator('EmailAddress', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.EmailAddress:'',
                                              rules: [{ required: true, message: intl.formatMessage({ id:'event.message.email'}) }]
                                  })(  
                                      <Input disabled={disabled} />
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.PaymentInstrument'})} className={styles.fromItem}>
                                      {getFieldDecorator('PaymentType', {
                                              initialValue:NewAttendeeDate!=[]?NewAttendeeDate.PaymentType:undefined,
                                              rules: [{ required: true, message: intl.formatMessage({ id:'event.message.Paymentinstrument'}) }],
                                  })(  
                              <Select>
                                      <Option value={1005002}>{intl.formatMessage({id:'event.manage.onlinePayment'})}</Option>
                                        <Option value={1005003}>{intl.formatMessage({id:'event.manage.offlinePayment'})}</Option>
                                        <Option value={1005001}>{intl.formatMessage({id:'event.manage.transferAccounts'})}</Option>                                   
                                        </Select>
                                  )}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                              <FormItem label={intl.formatMessage({id:'event.manage.discount'})} className={styles.fromItem}>
                                      {getFieldDecorator('DiscountId', {
                                            initialValue:NewAttendeeDate!=[]?(NewAttendeeDate.DiscountId=='00000000-0000-0000-0000-000000000000'?undefined:NewAttendeeDate.DiscountId+""):undefined,
                                              // rules: [{ required: true, message: intl.formatMessage({ id:'event.message.Discount'}) }],
                                  })(  
                              <Select>
                                        {DiscountListDate}
                                  </Select>
                                  )}
                                  </FormItem>
                              </Col>
                            </Row>
                      </Form>
                    </Modal>
                  <Spin spinning={spinning}>
                    <Table rowSelection={rowSelection} dataSource={AttendeeList} columns={columns} style={{ marginTop: 10 }} />
                  </Spin>
                  <Modal
                      title={intl.formatMessage({id:'event.manage.Batchchangediscount'})}
                      visible={this.state.ModalDiscount}
                      onOk={this.BatchDiscount}
                      onCancel={this.DiscountCancel}
                      width={600}
                      destroyOnClose
                    >
                    <FormItem>
                     {getFieldDecorator('BatchDiscount', {
                         rules: [{ required: true, message: intl.formatMessage({ id:'event.message.Discount'}) }]
                                  })(  
                      <Select style={{width:"100%"}}>
                        {DiscountListDate}
                      </Select>
                                  )}
                    </FormItem>
                    </Modal>
                </div>
                }
              </div>
           )
      }
}
export default connect(({eventManage = {}, loading }) => ({
  AttendeeList:eventManage.AttendeeList,
  DiscountList:eventManage.DiscountList,
}))(injectIntl(Attendee));