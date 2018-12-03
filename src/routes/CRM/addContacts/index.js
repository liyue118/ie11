import React, { Component } from 'react';
import { Modal, Button, Form , Icon, Input, Avatar, Col,Row,Select,Radio,Upload,message} from 'antd';
import CascaderAdress from '../../../components/CascaderAddress'
import { connect } from 'dva';
import {injectIntl,formatMessage} from 'react-intl';
import {getBase64,getLocale} from '../../../utils/utils'
import styles from  './index.less';
const FormItem=Form.Item;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

function beforeUpload(file) {
  const isJPG = (file.type === 'image/png'|| file.type === 'image/jpeg');
  if (!isJPG) {
    // message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}
@Form.create()
class Addcontacts extends Component{
  constructor(props) {
    super(props);
    this.state={ visible: props.isShow,
                  isSpeaker:false,
                  uploadLoading:false,
                  SectorList:[],
                  detailData:[],
                  ContactAdminList:[],
                  ContactAddress:[],
                  CompanyAddress:[],
                  PersonId:'',
                  destroyOnClose:false
                }
  }
  componentDidMount(){
    const {dispatch}=this.props;
    this.props.onRef(this);
    dispatch({
      type:"contacts/IndustryDropdownList",
    })
    dispatch({
      type:"contacts/ContactGroupList",
    })
    dispatch({
      type:"contacts/ContactAdminList",
      callback:data=>{
        this.setState({ContactAdminList:data})
      }
    })
  }
  showModal = (value) => {
    if(this.state.isSpeaker){
    this.props.form.resetFields()
    }
    this.setState({
      visible: value,
      detailData:[],
      isSpeaker:false,
    });
  }
  OnEdit=(data)=>{
    const{dispatch}=this.props;
    this.props.form.resetFields();
    this.setState({imageUrl:'',uploadLoading:false})
    dispatch({
      type:"contacts/ContactDetail",
      payload:{PersonId:data.PersonId},
      callback:data=>{
        this.ChangeIndustry(data.Industry);
        this.setState({detailData:data})
      }
    })
    this.setState({PersonId:data.PersonId,isSpeaker:data.IsSpeaker,visible:true})
  }
  handleOk = (e) => {
    const {ContactAddress,CompanyAddress,detailData}=this.state;
    const {dispatch}=this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const CompanyA={
        CompanyCountry:"中国",
        CompanyProvince:ContactAddress[0],
        CompanyCity:ContactAddress[1],
        CompanyDistrict:ContactAddress[2]
      }
      const CotactsA={
        Country:"中国",
        Province:CompanyAddress[0],
        City:CompanyAddress[1],
        District:CompanyAddress[2]
      }
      let value={
        ...fieldsValue,
        ...CompanyA,
        ...CotactsA,
        Photo:this.state.imageUrl
      }
      for(var p in value){
        if(value[p]==undefined){
            value[p]=null
        }
      }
      
      if(detailData.length!=0){
        value={
          ...value,
          PersonId:this.state.PersonId
        }
        dispatch({
          type:'contacts/ContactEdit',
          payload:value,
          callback:data=>{
            this.setState({visible:false})
            if(data.ReturnCode=='1001'){
              this.props.refTable();
              message.success('Edit success!');
           }
          }
        })
      }else{
        dispatch({
          type:'contacts/ContactAddition',
          payload:value,
          callback:data=>{
            this.setState({visible:false})
            if(data.ReturnCode=='1001'){
              this.props.refTable();
              message.success('Add success!');
           }
          }
        })
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  ContactAddress =(data)=>{
    this.setState({ContactAddress:data})
  }
  CompanyAddress =(data)=>{
    this.setState({CompanyAddress:data})
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl,
      uploadLoading: false,
    }));
  }
  ChangeIndustry=(value)=>{
    const {IndustryList}=this.props;
    console.log(IndustryList);
    this.props.form.resetFields(['Sector']);
    IndustryList.map(data=>{
      if(data.Id==value){
        const dataSector=[];
        data.Children.forEach(element=>{
            dataSector.push({
                Id:element.Value,
                Name:element.Label,
              })
          })
        this.setState({SectorList:dataSector});
      }
    })
    
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {IndustryList,ContactGroupList}=this.props
    const {SectorList,detailData,ContactAdminList}=this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      fontSize:"12px"
    };
     const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload Avatar</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const IndustryListData=IndustryList!=[]?IndustryList.map(event => <Option key={event} value={event.Id}>{event.Name}</Option>):'';
    const SectorListData=SectorList!=[]?SectorList.map(event => <Option key={event} value={event.Id}>{event.Name}</Option>):'';
    const ContactGroupListData=ContactGroupList!=[]?ContactGroupList.map(event => <Option key={event.Key} value={event.Key}>{event.Value}</Option>):'';
    const ContactAdminListData=ContactAdminList!=[]?ContactAdminList.map(event => <Option key={event.Key} value={event.Key}>{event.Value}</Option>):'';
    return (
      <span>
        <Button type="primary" onClick={this.showModal.bind(this,true)} style={{marginLeft:8}}>+ 新添加联系人 </Button>
        <Modal 
        title="添加到联系人"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={840}
        cancelText="取消"
        okText="确认">
         <Form>
          <Row gutter={24}>
            <Col span={16} className={styles.modalAddTitle}>个人信息</Col>
            <Col span={24} style={{textAlign:"center"}}>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                style={{margin:"auto",display:"block",width:"104px",height:"104px"}}
                showUploadList={false}
                
                // action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:"100%",height:"100%"}}/> : uploadButton}
              </Upload>
            </Col>
            <Col span={12}>
            <FormItem label='姓' className={styles.fromItem}>
            {getFieldDecorator('FirstName', {
                        initialValue:detailData.FirstName,
                        rules: [{ required: true, message: 'Please input event title！' }],
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            
            <Col span={12}>
            <FormItem label='名' className={styles.fromItem} >
                 {getFieldDecorator('LastName', {
                        initialValue:detailData.LastName,
                        rules: [{ required: true, message: 'Please input event title！' }],
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            <Col span={12} >
            <FormItem label='电子邮箱' className={styles.fromItem}>
            {getFieldDecorator('Email', {
                        initialValue:detailData.Email,
                        rules: [{ required: true, message: 'Please input event title！' }],
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            <Col span={12} >
            <FormItem label='电话' className={styles.fromItem}>
            {getFieldDecorator('PhoneNumber', {
                        initialValue:detailData.PhoneNumber,
                        rules: [{ required: true, message: 'Please input event title！' }],
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            
            <Col span={12} >
            <FormItem label='所属行业' className={styles.fromItem}>
            {getFieldDecorator('Industry', {
                        initialValue:detailData.Industry,
                        rules: [{ required: true, message: 'Please input event title！' }],
                    })(  
                      <Select onChange={this.ChangeIndustry}>
                      {IndustryListData}
                  </Select>
                  )}
              
             </FormItem>
            </Col>
            <Col span={12} >
            <FormItem label='部门' className={styles.fromItem}>
              {getFieldDecorator('Sector', {
                        initialValue:detailData.Sector,
                    })(  
                    <Select>
                      {SectorListData}
                    </Select>
                  )}
             </FormItem>
            </Col>
            <Col span={24} >
            <FormItem label='公司' className={styles.fromItem}>
            {getFieldDecorator('CompanyName', {
                        initialValue:detailData.CompanyName,
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            <Col span={12} >
            <FormItem label='公司电话' className={styles.fromItem}>
            {getFieldDecorator('CompanyPhoneNumber', {
                        initialValue:detailData.CompanyPhoneNumber,
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            <Col span={12} >
            <FormItem label='职位' className={styles.fromItem}>
            {getFieldDecorator('JobTitle', {
                        initialValue:detailData.JobTitle,
                    })(  
                      <Input />
                  )}
             </FormItem>
            </Col>
            </Row>
            {!this.state.isSpeaker?
            <Row gutter={24}>
                 <Col span={24} >
                  <FormItem label='个人地址' className={styles.fromItem}>
                    <CascaderAdress CascaderAdressValue={this.ContactAddress} style={{width:"50%"}}/>
                  {getFieldDecorator('Street', {
                        initialValue:detailData.Street,
                    })(  
                      <Input style={{width:'48%',marginLeft:'2%'}}/>
                  )}
                  </FormItem>
                </Col>
                <Col span={24} >
                <FormItem label='公司地址' className={styles.fromItem}>
                    <CascaderAdress CascaderAdressValue={this.CompanyAddress} style={{width:"50%"}}/>
                    {getFieldDecorator('CompanyStreet', {
                        initialValue:detailData.CompanyStreet,
                    })(  
                      <Input style={{width:'48%',marginLeft:'2%'}}/>
                  )}
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='指派联系人' className={styles.fromItem}>
                 
                  {getFieldDecorator('OwnerId', {
                        initialValue:detailData.Owner,
                    })(  
                      <Select>
                        {ContactAdminListData}
                      </Select>
                  )}
                </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='添加到联系人列表' className={styles.fromItem}>
                  {getFieldDecorator('ContactGroupIds', {
                        initialValue:detailData.ContactGroups,
                    })(  
                      <Select
                      mode="tags"
                      >
                        {ContactGroupListData}
                      </Select>
                  )}
                </FormItem>
                </Col>
                <Col span={16} className={styles.modalAddTitle}>其他信息</Col>
                <Col span={12} >
                  <FormItem label='发票抬头*' className={styles.fromItem}>
                  {getFieldDecorator('BizRegistraionName', {
                        initialValue:detailData.BizRegistraionName,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>  
                <Col span={12} >
                  <FormItem label='税号*' className={styles.fromItem}>
                  {getFieldDecorator('TaxPayerCode', {
                        initialValue:detailData.TaxPayerCode,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='开户银行' className={styles.fromItem}>
                  {getFieldDecorator('BankName', {
                        initialValue:detailData.BankName,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='银行账号' className={styles.fromItem}>
                  {getFieldDecorator('BankAccount', {
                        initialValue:detailData.BankAccount,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='企业地址' className={styles.fromItem}>
                  {getFieldDecorator('BizRegistraionAddress', {
                        initialValue:detailData.BizRegistraionAddress,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label='企业电话' className={styles.fromItem}>
                  {getFieldDecorator('BizRegistraionPhoneNumber', {
                        initialValue:detailData.BizRegistraionPhoneNumber,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
            </Row>
            :
            <Row gutter={24}>
                <Col span={24} >
                  <FormItem label='个人网站' className={styles.fromItem}>
                  {getFieldDecorator('Website', {
                        initialValue:detailData.Website,
                    })(  
                      <Input />
                  )}
                </FormItem>
                </Col>
                <Col span={24} >
                  <FormItem label='描述' className={styles.fromItem}>
                  {getFieldDecorator('Introduction', {
                        initialValue:detailData.Introduction,
                    })(  
                      <TextArea rows={2} />
                  )}
                </FormItem>
                </Col>
            </Row>
            }
         </Form>
        </Modal>
        </span>
    );
  }
}
export default connect(({contacts = {}, loading }) => ({
  IndustryList:contacts.IndustryList,
  ContactGroupList:contacts.ContactGroupList
}))(injectIntl(Addcontacts)); 