import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Spin, Menu, Dropdown, Form,message  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../../utils/utils';
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
@Form.create()
class Invoice extends Component {    
      constructor(props){
          super(props);
          const {intl}=props;
          this.ActionsMenuData=[{key:'Edit',name:intl.formatMessage({id:'event.invoice.Modify'})},
          // {key:'Checktheregistration',name:intl.formatMessage({id:'event.manage.Checktheregistration'})},
          {key:'ChangeStatus',name:intl.formatMessage({id:'event.manage.ChangeStatus'})},
          {key:'delete',name:intl.formatMessage({id:'event.manage.CancelRequest'})}
          ]
          this.state={
              isChecked:false,
              eventid:getPageQuery(props.location.search).id,
              isChoose:false,
              invoiceStatus:"",
              invoiceType:'',
              sendType:'',
              M1Disable:false,
              confirmLoading:false,
              spinning:true,
              invoiceData:[],
              EditData:[]
          }
      }
      createMenu=()=>{
        const {invoiceData}=this.state;
        const {intl}=this.props;
        return this.ActionsMenuData.map(data=>{
           if((invoiceData.InvoiceStatus=='1013003') && data.key=='delete'){
              return;
           }
           return (<Menu.Item key={data.key}>{data.name}</Menu.Item>);
        })    
      }
      componentDidMount(){
        const  {dispatch } = this.props;
        dispatch({
            type:'invoice/InvoiceListByFilter',
            payload:{
              EventId:this.state.eventid,
              InvoiceStatus:this.state.invoiceStatus,
              InvoiceType:this.state.invoiceType,
              InvoiceSendType:this.state.sendType
            },
            callback:data=>{
              this.setState({spinning:false})
            }
        })

      }
      RequireInvoice=()=>{
        //InvoiceDetailsInfoSave
        const {dispatch}=this.props;
        const {EditData,invoiceData}=this.state;
        this.props.form.validateFields((err, fieldsValue) => {
          delete fieldsValue['people'];
          fieldsValue['ApplyPersonId']=EditData.PersonList[0].PersonId;
          let value={
            ...fieldsValue,
            OrderId:invoiceData.OrderId,
            PersonListId:invoiceData.PersonListId
          }
          this.setState({confirmLoading:true})
          dispatch({
            type:'invoice/InvoiceDetailsInfoSave',
            payload:value,
            callback:data=>{
              if(data.ReturnCode==1001){
                message.success('修改成功')
                this.setState({confirmLoading:false,M1Disable:false})
              }
            }
        })
        })

      }
      handleCancel=()=>{
        this.setState({M1Disable:false,confirmLoading:false})
      }
      changeStatus=(name,value)=>{
        const  {dispatch } = this.props;
        console.log(name,value)
        if(name=="invoiceStatus"){
          this.setState({invoiceStatus:value})
        }else if(name=="invoiceType"){
          this.setState({invoiceType:value})
        }else{
          this.setState({sendType:value});
        }
        this.setState({spinning:true})
        setTimeout(() => {
          this.InvoiceListByFilter()
        }, 50);
      }
      InvoiceListByFilter=()=>{
        const {dispatch}=this.props;
        const {eventid,invoiceStatus,invoiceType,sendType}=this.state;
        dispatch({
          type:'invoice/InvoiceListByFilter',
          payload:{
            EventId:eventid,
            InvoiceStatus:invoiceStatus,
            InvoiceType:invoiceType,
            InvoiceSendType:sendType
          },
          callback:data=>{
            this.setState({spinning:false})
          }
        })
      }
      handleMenuClick=(key)=>{
        const {dispatch,intl}=this.props;
        const {invoiceData}=this.state;
        key=key.key;
        this.setState({spinning:true});
        if(key=="Edit"){
          dispatch({
            type:'invoice/InvoiceDetailsInfoGet',
            payload:{
              OrderId:invoiceData.OrderId,
              PersonListId:invoiceData.PersonListId
            },
            callback:data=>{
              this.setState({EditData:data,spinning:false,M1Disable:true})
            }
          })
        }else if(key=='delete'){
          //InvoiceApplyCancel
          let _self=this;
          confirm({
            title: intl.formatMessage({id:'event.message.cancelTicket'}),
            content: '',
            okText: intl.formatMessage({id:'event.Confirm'}),
            okType: 'danger',
            cancelText: intl.formatMessage({id:'event.Cancel'}),
            onOk() {
              dispatch({
                type:'invoice/InvoiceApplyCancel',
                payload:{
                  OrderId:invoiceData.OrderId,
                  PersonListId:invoiceData.PersonListId
                },
                callback:data=>{
                  console.log(data);
                  if(data.ReturnCode=='1001'){
                    _self.InvoiceListByFilter()
                  }else{
                    _self.setState({spinning:false})
                  }
                }
              })
            },
            onCancel() {},
          });
        }else if(key=='ChangeStatus'){
          dispatch({
            type:'invoice/InvoiceStatusUpdte',
            payload:{
              OrderId:invoiceData.OrderId,
              PersonListId:invoiceData.PersonListId
            },
            callback:data=>{
              console.log(data);
              if(data.ReturnCode=='1001'){
                this.InvoiceListByFilter()
              }else{
                this.setState({spinning:false})
              }
            }
          })

        }
      }
      saveData=(text)=>{
        console.log(text);
        this.setState({invoiceData:text})
      }
      BatchIssuedInvoice=()=>{
        const{selectedRowKeys}=this.state;
        const{dispatch}=this.props;
        this.setState({spinning:true});
        dispatch({
          type:'invoice/InvoiceBatch',
          payload:{
            OrderListId:selectedRowKeys,
          },
          callback:data=>{
            if(data.ReturnCode=='1001'){
              this.InvoiceListByFilter()
            }else{
              this.setState({spinning:false})
            }
          }
        })

      }
      render() {
          const {intl,invoicelistData}=this.props;
          const { getFieldDecorator } = this.props.form;
          const {spinning,EditData}=this.state;
          const menu = (
            <Menu onClick={this.handleMenuClick}>
              {this.createMenu()}
            </Menu>
          );
          const columns = [{
            title:intl.formatMessage({id:'event.manage.OrderId'}),
            dataIndex: 'OrderId',
            key: 'orderId',
          },{
            title: intl.formatMessage({id:'event.manage.EventName'}),
            dataIndex: 'Title',
            key: 'eventName',
          },{
            title: intl.formatMessage({id:'event.manage.ApplicationDate'}),
            dataIndex: 'CreateDate',
            key: 'date',
          },{
            title:intl.formatMessage({id:'event.manage.Attendee'}),
            dataIndex: 'AttendeeName',
            key: 'payments',
          },{
            title: intl.formatMessage({id:'event.invoice.application'}),
            dataIndex: 'application',
            key: 'payee',
          },{
            title: intl.formatMessage({id:'event.manage.InvioceType'}),
            dataIndex: 'InvoiceType',
            key: 'type',
          },{
            title: intl.formatMessage({id:'event.manage.Amount'}),
            dataIndex: 'InvoiceAmount',
            key: 'money',
          },{
            title: intl.formatMessage({id:'event.manage.DeliveryStatus'}),
            dataIndex: 'InvoiceStatus',
            key: 'state',
          },{
            title: intl.formatMessage({id:'event.manage.DeliveryMethods'}),
            dataIndex: 'SendType',
            key: 'mode',
          },{
            title:intl.formatMessage({id:'event.table.action'}),
            dataIndex: 'action',
            render: (text, record) => (
               <div>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']} onClick={this.saveData.bind(this,text)}>
                 <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
              </Dropdown>
               </div>
            ),
          }];
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              selectedRowKeys.length>0?this.setState({isChoose:true,selectedRowKeys:selectedRowKeys}):this.setState({isChoose:false,selectedRowKeys:[]});
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
          console.log(EditData);
          return ( 
             <Row className={styles.main}>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                      {intl.formatMessage({id:'event.menu.Invoice'})}
                    </div>
               </div>
               <div className={styles.content}>
                  <div>
                        <Button type="primary" icon="download" style={{marginLeft:10}}></Button>  
                        <Select defaultValue="" onChange={this.changeStatus.bind(this,'invoiceStatus')} style={{ width: 100,marginRight:10,marginLeft:10}}>
                              <Option value=""> {intl.formatMessage({id:'event.manage.Status'})}</Option>
                              <Option value="1013002">{intl.formatMessage({id:'event.manage.Required'})}</Option>
                              <Option value="1013003">{intl.formatMessage({id:'event.manage.Issued'})}</Option>
                        </Select>
                        <Select defaultValue="" onChange={this.changeStatus.bind(this,'invoiceType')} style={{width:130,marginRight:10,marginLeft:10}}>
                              <Option value="">{intl.formatMessage({id:'event.manage.AllInvoices'})}</Option>
                              <Option value="1011002">{intl.formatMessage({id:'event.manage.VATSpecialInvoice'})}</Option>
                              <Option value="1011001">{intl.formatMessage({id:'event.manage.VATInvoice'})}</Option>
                        </Select>
                        <Select defaultValue="" onChange={this.changeStatus.bind(this,'sendType')} style={{ width: 150,marginRight:10,marginLeft:10}}>
                              <Option value="">{intl.formatMessage({id:'event.manage.AllDeliveryMethods'})}</Option>
                              <Option value="1012001  ">{intl.formatMessage({id:'event.manage.Express'})}</Option>
                              <Option value="1012002  ">{intl.formatMessage({id:'event.manage.On-site'})}</Option>
                        </Select>
                        {this.state.isChoose?
                        <Button type="primary" onClick={this.BatchIssuedInvoice}>{intl.formatMessage({id:'event.manage.BatchIssuedInvoice'})}</Button>
                        :null}
                    </div>
                    <Spin spinning={spinning}>
                    <Table rowSelection={rowSelection} dataSource={invoicelistData} columns={columns} style={{marginTop:10}} />   
                    </Spin>
               </div>
               <Modal
                  title={intl.formatMessage({ id:'event.table.edit'})}
                  visible={this.state.M1Disable}
                  onOk={this.RequireInvoice}
                  onCancel={this.handleCancel}
                  confirmLoading={this.state.confirmLoading}
                  width={600}
                  destroyOnClose
                >
                      <Form>
                            <Row gutter={24}>
                                  <Col span={24}>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.applicationNumber'})} className={styles.fromItem}>
                                            {getFieldDecorator('people', {
                                                    initialValue:1,
                                                  //   rules: [{ required: true, message: 'Please input  n' }]
                                        })(  
                                          <Input disabled/>
                                        )}
                                  </FormItem>
                                  <span className={styles.buleTitile} style={{marginBottom:"5px",display: "block",marginLeft: "10px",fontSize:12}}>
                                  {EditData.AttendeeName}
                                  </span>
                                  </Col>
                                  <Col span={24}>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.application'})} className={styles.fromItem}>
                                            {getFieldDecorator('ApplyPersonId', {
                                                    initialValue:EditData.FirstName+EditData.LastName,
                                                    rules: [{ required: true, message: intl.formatMessage({id:'event.message.application'}) }]
                                        })(  
                                          <Input disabled/>
                                        )}
                                  </FormItem>
                                  </Col>
                                  <Col span={24}>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.InvoiceType'})} className={styles.fromItem}>
                                            {getFieldDecorator('InvoiceType', {
                                                  initialValue:EditData.InvoiceType,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.InvoiceType'}) }]
                                        })(  
                                          <Select onChange={this.InvoiceTypechange} disabled>
                                              <Option value='1011001'>{intl.formatMessage({id:'event.manage.VATInvoice'})}</Option>
                                              <Option value='1011002'>{intl.formatMessage({id:'event.manage.VATSpecialInvoice'})}</Option>
                                          </Select>
                                        )}
                                  </FormItem>
                                  </Col>
                                  <Col span={24}>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.Receivinginformation'})} className={styles.fromItem}>
                                            {getFieldDecorator('SendType', {
                                                  initialValue:EditData.SendType,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.SendType'}) }]
                                        })(  
                                          <Select  onChange={this.SendingTypeChange} disabled>
                                              <Option value='1012001'>{intl.formatMessage({id:'event.manage.Express'})}</Option>
                                              <Option value='1012002'>{intl.formatMessage({id:'event.manage.On-site'})}</Option>
                                          </Select>
                                        )}
                                  </FormItem>
                                  </Col>
                                  <Col span={24} >
                                      <div className={styles.invoiceMoney}>{intl.formatMessage({id:'event.invoice.InvoiceAmount'})}:<span style={{fontSize:26,marginLeft:10,marginRight:3}}>{EditData.InvoiceAmount}</span>(含税)</div>
                                      <div className={styles.buleTitile} style={{margin:'12px 0'}}>{intl.formatMessage({id:'event.invoice.Improveinvoiceinformation'})}</div>        
                                  </Col>
                                  <Col span={24}>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.InvoiceTitle'})}  className={styles.fromItem}>
                                            {getFieldDecorator('InvoiceTitle', {
                                                  initialValue:EditData.Title,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.InvoiceTitle'}) }]
                                        })(  
                                          <Input/>
                                        )}
                                  </FormItem>
                                  <FormItem label={intl.formatMessage({id:'event.invoice.taxid'})} className={styles.fromItem}>
                                            {getFieldDecorator('TaxPayerCode', {
                                                  initialValue:EditData.TaxPayerCode,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.taxid'}) }]
                                        })(  
                                          <Input/>
                                        )}
                                  </FormItem>
                                  {this.state.InvoiceType=="1011002"?
                                  <span>
                                      <FormItem label={intl.formatMessage({id:'event.ticket.bankname'})} className={styles.fromItem}>
                                            {getFieldDecorator('BankName', {
                                                  initialValue:EditData.BankName,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.bankname'}) }]
                                          })(  
                                              <Input/>
                                          )}
                                      </FormItem>
                                      <FormItem label={intl.formatMessage({id:'event.ticket.bankNumber'})} className={styles.fromItem}>
                                              {getFieldDecorator('BankAccount', {
                                                  initialValue:EditData.BankAccount,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.banknumber'}) }]
                                          })(  
                                              <Input/>
                                          )}
                                      </FormItem>
                                      <FormItem label={intl.formatMessage({id:'event.invoice.companyPhone'})} className={styles.fromItem}>
                                              {getFieldDecorator('CompanyPhone', {
                                                  initialValue:EditData.CompanyPhone,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.qiyePhone'}) }]
                                          })(  
                                              <Input/>
                                          )}
                                      </FormItem>
                                      <FormItem label={intl.formatMessage({id:'event.invoice.CompanyAddress'})} className={styles.fromItem}>
                                              {getFieldDecorator('CompanyAddress', {
                                                  initialValue:EditData.CompanyAddress,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.qiyeAddress'}) }]
                                          })(  
                                              <Input/>
                                          )}
                                      </FormItem>
                                  </span>
                                  :null}
                                  <FormItem label={intl.formatMessage({id:'event.invoice.ConsigneeInformation'})} className={styles.fromItem}>
                                            {getFieldDecorator('InvoiceSendAddress', {
                                                  initialValue:EditData.InvoiceSendAddress,
                                                  rules: [{ required: true, message: intl.formatMessage({id:'event.message.ConsigneeInformation'}) }]
                                        })(  
                                          <Input/>
                                        )}
                                  </FormItem>
                                  </Col>

                            </Row>
                      </Form>
                
                </Modal>
             </Row>
           )
      }
}
export default connect(({invoice = {}, loading }) => ({
  invoicelistData:invoice.invoicelistData
}))(injectIntl(Invoice));