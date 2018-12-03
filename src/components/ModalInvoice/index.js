import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Tooltip, Menu, message, Form  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import styles from './index.less'
const FormItem =Form.Item;
const { Option, OptGroup } = Select;

@Form.create()
class ModalInvoice extends Component {  
    constructor(props){
        super(props);
        this.state={
            M1Disable:false,
            confirmLoading:false,
            NameData:[],
            personId:[],
            InvoiceType:'1011001',
            SendingType:'1012001',
            AttendeeInvoiceDetails:[],
            Applicant:[],

        }
    }
    componentDidMount(){
        this.props.onRef(this);
    }
    showModal(selectedRows){
        console.log(selectedRows);
        const NameData=[],personId=[];
        const messageName=[];
        let hasUnpaid=false,hasInvoice=false;
        if(selectedRows.length>1){
            selectedRows.forEach(element => {
                if(element.PaymentStatus=='未支付'){
                    hasUnpaid=true
                }else if(!(element.InvoiceStatus=='1013001')){
                    hasInvoice=true
                }
                NameData.push({
                    name:element.FirstName+element.LastName,
                    personId:element.AttendeeId,
                    PaymentStatus:element.PaymentStatus,
                    InvoiceStatus:element.InvoiceStatus
                })
                personId.push(element.AttendeeId);
            })
        }else{
            if(selectedRows.PaymentStatus=='未支付'){
                hasUnpaid=true
            }else if(!selectedRows.InvoiceStatus=='1013001'){
                hasInvoice=true
            }
            NameData.push({
                name:selectedRows.FirstName+selectedRows.LastName,
                personId:selectedRows.AttendeeId,
                PaymentStatus:selectedRows.PaymentStatus,
                InvoiceStatus:selectedRows.InvoiceStatus
            })
            personId.push(selectedRows.AttendeeId);
        }
        this.setState({NameData:NameData,personId:personId})
        console.log(hasUnpaid,hasInvoice);
        if(hasUnpaid){
            NameData.forEach(element=>{
               if(element.PaymentStatus=='未支付'){
                 messageName.push(element.name);
               }
            })  
            this.props.spinningStatus(false);
            message.success(messageName.join(',')+'未支付，不能合并开票!');   
            return;  
        }else if(!hasUnpaid && hasInvoice){
            NameData.forEach(element=>{
                if(!(element.InvoiceStatus=='1013001')){
                    messageName.push(element.name);
                }
             })
             this.props.spinningStatus(false);   
            message.success(messageName.join(',')+'重复开票，不能合并开票!');     
            return
        }else{
            this.showDetail(personId);
        }
    }
    showDetail=(personId)=>{
        const {dispatch,eventId}=this.props;//InvoiceDetailsInfoGet
        dispatch({
            type:'invoice/AttendeeInvoiceDetailsInfoGet',
            payload:{eventId:eventId,personListId :personId.join(",")},
            callback:data=>{
                this.props.spinningStatus(false);
                this.setState({
                    InvoiceType:data.InvoiceType,
                    SendingType:data.SendType,
                    AttendeeInvoiceDetails:data,
                    M1Disable:true})
            }
        })

    }
    

    handleCancel=()=>{
        this.setState({M1Disable:false,confirmLoading:false})
    }
    //索要发票
    RequireInvoice=()=>{
        const {dispatch,eventId}=this.props;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.setState({confirmLoading:true})
            delete fieldsValue['people'];
            const value={
                ...fieldsValue,
                attendeeInvoiceInfo:{
                    eventId:eventId,
                    personListId:this.state.personId.join(",")
                }
            }
            dispatch({
                type:'invoice/AttendeeInvoiceDetailsInfoSave',
                payload:value,
                callback:data=>{
                    if(data.ReturnCode==1001){
                        message.success("申请开票成功！");
                        this.props.onRefresh();
                        this.setState({M1Disable:false,confirmLoading:false})
                    }
                }
            })

        })
    }
    
    InvoiceTypechange=(value)=>{
        this.setState({InvoiceType:value})
    }
    SendingTypeChange=(value)=>{
        this.setState({SendingType:value})
    }
    onChange=(value)=>{
        // UserAppointStubHubGetting
        const {dispatch}=this.props;//InvoiceDetailsInfoGet
        dispatch({
            type:'invoice/UserAppointStubHubGetting',
            payload:{id:value},
            callback:data=>{
                this.setState({Applicant:data})
            }
        })
    }
    render() {
        const {intl}=this.props;
        const { getFieldDecorator } = this.props.form;
        const {NameData,AttendeeInvoiceDetails,Applicant}=this.state;
        const NameDataList=NameData.map(event => <Option key={event.personId} value={event.personId}>{event.name}</Option>);
        const NameShow=NameData.map(event =>event.name);
        return (
            <Modal
            title={intl.formatMessage({ id:'event.manage.RequireInvoice'})}
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
                                              initialValue:NameData.length,
                                            //   rules: [{ required: true, message: 'Please input  n' }]
                                  })(  
                                     <Input disabled/>
                                  )}
                            </FormItem>
                            <span className={styles.buleTitile} style={{marginBottom:"5px",display: "block",marginLeft: "10px",fontSize:12}}>
                            {NameShow.join(",")}
                            </span>
                            </Col>
                            <Col span={24}>
                            <FormItem label={intl.formatMessage({id:'event.invoice.application'})} className={styles.fromItem}>
                                      {getFieldDecorator('ApplyPersonId', {
                                              rules: [{ required: true, message: intl.formatMessage({id:'event.message.application'}) }]
                                  })(  
                                     <Select onChange={this.onChange}>
                                         {NameDataList}
                                     </Select>
                                  )}
                            </FormItem>
                            </Col>
                            <Col span={24}>
                            <FormItem label={intl.formatMessage({id:'event.invoice.InvoiceType'})} className={styles.fromItem}>
                                      {getFieldDecorator('InvoiceType', {
                                            initialValue:'1011001',
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.InvoiceType'}) }]
                                  })(  
                                     <Select onChange={this.InvoiceTypechange}>
                                        <Option value='1011001'>{intl.formatMessage({id:'event.manage.VATInvoice'})}</Option>
                                        <Option value='1011002'>{intl.formatMessage({id:'event.manage.VATSpecialInvoice'})}</Option>
                                     </Select>
                                  )}
                            </FormItem>
                            </Col>
                            <Col span={24}>
                            <FormItem label={intl.formatMessage({id:'event.invoice.Receivinginformation'})} className={styles.fromItem}>
                                      {getFieldDecorator('SendType', {
                                            initialValue:'1012001',
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.SendType'}) }]
                                  })(  
                                     <Select  onChange={this.SendingTypeChange}>
                                        <Option value='1012001'>{intl.formatMessage({id:'event.manage.Express'})}</Option>
                                        <Option value='1012002'>{intl.formatMessage({id:'event.manage.On-site'})}</Option>
                                     </Select>
                                  )}
                            </FormItem>
                            </Col>
                            <Col span={24} >
                                <div className={styles.invoiceMoney}>{intl.formatMessage({id:'event.invoice.InvoiceAmount'})}:<span style={{fontSize:26,marginLeft:10,marginRight:3}}>{AttendeeInvoiceDetails.InvoiceAmount}</span>(含税)</div>
                                <div className={styles.buleTitile} style={{margin:'12px 0'}}>{intl.formatMessage({id:'event.invoice.Improveinvoiceinformation'})}</div>        
                            </Col>
                            <Col span={24}>
                            <FormItem label={intl.formatMessage({id:'event.invoice.InvoiceTitle'})}  className={styles.fromItem}>
                                      {getFieldDecorator('InvoiceTitle', {
                                            initialValue:Applicant!=[]?Applicant.InvoiceTitle:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.InvoiceTitle'}) }]
                                  })(  
                                     <Input/>
                                  )}
                            </FormItem>
                            <FormItem label={intl.formatMessage({id:'event.invoice.taxid'})} className={styles.fromItem}>
                                      {getFieldDecorator('TaxPayerCode', {
                                            initialValue:Applicant!=[]?Applicant.TaxPayerCode:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.taxid'}) }]
                                  })(  
                                     <Input/>
                                  )}
                            </FormItem>
                            {this.state.InvoiceType=="1011002"?
                            <span>
                                <FormItem label={intl.formatMessage({id:'event.ticket.bankname'})} className={styles.fromItem}>
                                      {getFieldDecorator('BankName', {
                                            initialValue:Applicant!=[]?Applicant.BankName:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.bankname'}) }]
                                    })(  
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem label={intl.formatMessage({id:'event.ticket.bankNumber'})} className={styles.fromItem}>
                                        {getFieldDecorator('BankAccount', {
                                            initialValue:Applicant!=[]?Applicant.BankAccount:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.banknumber'}) }]
                                    })(  
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem label={intl.formatMessage({id:'event.invoice.companyPhone'})} className={styles.fromItem}>
                                        {getFieldDecorator('CompanyPhone', {
                                            initialValue:Applicant!=[]?Applicant.CompanyPhone:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.qiyePhone'}) }]
                                    })(  
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem label={intl.formatMessage({id:'event.invoice.CompanyAddress'})} className={styles.fromItem}>
                                        {getFieldDecorator('CompanyAddress', {
                                            initialValue:Applicant!=[]?Applicant.CompanyAddress:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.qiyeAddress'}) }]
                                    })(  
                                        <Input/>
                                    )}
                                </FormItem>
                            </span>
                            :null}
                            <FormItem label={intl.formatMessage({id:'event.invoice.ConsigneeInformation'})} className={styles.fromItem}>
                                      {getFieldDecorator('InvoiceSendAddress', {
                                            initialValue:Applicant!=[]?Applicant.InvoiceSendAddress:undefined,
                                            rules: [{ required: true, message: intl.formatMessage({id:'event.message.ConsigneeInformation'}) }]
                                  })(  
                                     <Input/>
                                  )}
                            </FormItem>
                            </Col>

                      </Row>
                </Form>
          
          </Modal>
        )
             
    }
}
export default connect(({event= {}, loading }) => ({
}))(injectIntl(ModalInvoice));