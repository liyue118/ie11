import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import antd, { Row, Col, Input, Modal, Dropdown, Menu, Button, Icon, Form, Select, Cascader, Table, Upload, message, AutoComplete } from 'antd';
import { formatMessage, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import styles from './PersonalSetting.less'
import SettingPanel from '../../components/SettingPanel';
import AddContact from '../../components/AddContact';
import PromptModal from '../../components/PromptModal';
import { Record } from 'immutable';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const formItemLayout1 = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 11,
        },
    },
};

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

@connect(({ personalInfos, loading }) => ({ //连接modal
    personalInfos,
}))
@Form.create()
class PersonalInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            maxFileSize: 1,
            IsHideList: {
                avatar: "",
                ShowDetails: true,
                ShowSchedule: true,
                ShowSpeaker: true,
                ShowSponsor: true,
                ShowDocument: true,
                ShowTicket: true,
                ShowDttEntity: true,
                Template: 'default',
            },
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch, personalInfos } = this.props;
        const { } = personalInfos;
        this.props.form.validateFields([
            "LastName", 
            'FirstName', 
            'hangye', 
            'CompanyName', 
            'JobTitle', 
            'Address', 
            'PhoneNumber', 
            'Email', 
            'CompanyPhone',
            'DetailAddress',
            'PersonAddress',
            'DetailPersonAddress',
        ],(err, values) => {
            if (err===null){
                const valueObj={
                    CompanyName: values.CompanyName,
                    Email: values.Email,
                    FirstName: values.FirstName,
                    JobTitle: values.JobTitle,
                    LastName: values.LastName,
                    Phone: values.PhoneNumber,
                    CompanyPhone: values.CompanyPhone,
                    Industry: values.hangye[0],
                    AddressCountry: "中国",
                    AddressProvince: values.Address[0],
                    AddressStreet: values.DetailAddress,
                    PersonProvince: values.PersonAddress[0],
                    PersonStreet: values.DetailPersonAddress,
                }
                if (values.PersonAddress.length===3){
                    valueObj['PersonCity'] = values.PersonAddress[1];
                    valueObj['PersonDistrict'] = values.PersonAddress[2];
                } else if (values.PersonAddress.length === 2){
                    valueObj['PersonCity'] = values.PersonAddress[1];
                    valueObj['PersonDistrict'] = '';
                } else if (values.PersonAddress.length === 1){
                    valueObj['PersonCity'] = '';
                    valueObj['PersonDistrict'] = '';
                }

                if (values.Address.length===3){
                    valueObj['AddressCity'] = values.Address[1];
                    valueObj['AddressDistrict'] = values.Address[2];
                } else if (values.Address.length === 2){
                    valueObj['AddressCity'] = values.Address[1];
                    valueObj['AddressDistrict'] = '';
                } else if (values.Address.length === 1){
                    valueObj['AddressCity'] = '';
                    valueObj['AddressDistrict'] = '';
                }

                if (values.hangye.length===2){
                    valueObj['Sector'] = values.hangye[1];
                } else if (values.hangye.length === 1){
                    valueObj['Sector'] = '';
                }
                dispatch({
                    type:"personalInfos/AccountInfoUpdate",
                    payload: valueObj
                })
            }
        });
    }
    handleTicketsSubmit = (e) => {
        e.preventDefault();
        const { dispatch, personalInfos } = this.props;
        const { ticketsInfos } = personalInfos;
        this.props.form.validateFields([
            "BizRegistraionName", 
            'TaxPayerCode', 
            'BankName', 
            'BankAccount', 
            'BizRegistraionAddress', 
            'BizRegistraionPhoneNumber',
            'RecipientContact',
            'RecipientContactPhone',
            'RecipientAddress'],(err, values) => {
            let obj={};
            if(err === null){
                console.log('values', values);
                obj.BizRegistraionName = values.BizRegistraionName;
                obj.TaxPayerCode = values.TaxPayerCode;
                obj.BankName = values.BankName;
                obj.BankAccount = values.BankAccount;
                obj.BizRegistraionAddress = values.BizRegistraionAddress;
                obj.PhoneNumber = values.BizRegistraionPhoneNumber;
                if (!!ticketsInfos && !!ticketsInfos.ClientId){
                    obj.ClientId = ticketsInfos.ClientId
                }else{
                    obj.ClientId = ''
                }
                obj.InvoiceSendAddress = values.RecipientContact + "/" + values.RecipientContactPhone + "/" + values.RecipientAddress;
                dispatch({
                    type:"personalInfos/saveStubHub",
                    payload: obj
                })
            }
        });
    }
    
    handleUserSubmit = (values) => {
        const { dispatch, personalInfos } = this.props;
        dispatch({
            type:"personalInfos/PersonContactSave",
            payload: values
        })
    }

    handleEditClick = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type:"personalInfos/changeDisabled",
            payload:{
                disabled:false
            }
        })
    }
    
    handleTicketsEditClick = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type:"personalInfos/changeDisabled",
            payload:{
                ticketsDisabled:false
            }
        })
    }

    handleDelete = (e, email) => {   //email 类似于userId
        console.log('email', email);
        const { dispatch, personalInfos} = this.props;
        confirm({
            title: 'Are you sure delete this task?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch({
                    type:"personalInfos/PersonContactDelete",
                    payload:{
                        Email: email
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
        dispatch({
            type: 'personalInfos/saveEmailId',
            payload:{
                emailId: email
            }
        })
    }

    handleAddUser = (e) => {    //点击添加联系人按钮
        const { dispatch } = this.props;
        dispatch({
            type: "personalInfos/changeVisible",
            payload: {
                visible: true
            }
        })
    }

    handleCancel = (form) => {  
        const {dispatch}=this.props;
        form.resetFields(["LastName1", 'FirstName1', 'hangye1', 'CompanyName1', 'JobTitle1', 'Address1', 'PhoneNumber1', 'Email1', 'CompanyPhone1'])
        dispatch({
            type:"personalInfos/changeVisible",
            payload:{
                visible:false
            }
        })
    }

    renderOptions = (industryArr) => {  //渲染options
        const { dispatch, personalInfos} =this.props;
        let arr=[];
        if (!!industryArr && industryArr.length){
            industryArr.map((item,index)=>{
                arr.push(<Option key={item.Key} value={item.Key}>{item.Value}</Option>)
            })  
        }
        return arr
    }

    // handlePromptOk = () => {    //确认框OK按钮
    //     const { dispatch, personalInfos} = this.props;
    //     const { promptObj, emailId} = personalInfos;
    //     if (promptObj.todo === "delete" && !!emailId){
    //         dispatch({
    //             type:"personalInfos/PersonContactDelete",
    //             payload:{
    //                 Email: emailId
    //             }
    //         })
    //     } else if (promptObj.todo === "closeModal"){
    //         dispatch({
    //             type: 'personalInfos/closePrompt',
    //             payload: {
    //                 visible: false,
    //                 onOk: () => { },
    //             },
    //         });
    //     }
    // }

    // handlePromptCancel = () => {    //确认框Cancel按钮
    //     const { dispatch, personalInfos } = this.props;
    //     const { promptObj } = personalInfos;
    //     dispatch({
    //         type: 'personalInfos/closePrompt',
    //         payload: {
    //             visible: false,
    //             onOk: () => { },
    //         },
    //     });
    // }

    handleChange = (info) => {
        const { dispatch, personalInfos} = this.props;
        // const { IsHideList } = personalInfos;
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        getBase64(info.file.originFileObj, imageUrl => {
            this.setState({
                IsHideList: {
                    ...this.state.IsHideList,
                    avatar: imageUrl
                },
                loading: false,
            })
            if (!!this.state.IsHideList.avatar && this.state.IsHideList.avatar !==""){
                dispatch({
                    type:"personalInfos/uploadAvatar",
                    payload:{
                        Avara: this.state.IsHideList.avatar
                    }
                })
            }
        });
    }

    beforeUpload = (file) => {
        const maxFileSize = this.state.maxFileSize;
        if (maxFileSize) {
            const isLtMax = file.size / 1024 / 1024 < maxFileSize;
            if (!isLtMax) {
                message.error(`文件大小超过${maxFileSize}M限制`);
            }
            return isLtMax;
        }
    }

    loadCascaderData = (selectedOptions) => {}

    onCascaderChange = (value, selectedOptions) => {    //级联菜单onChange事件
        const {dispatch} = this.props;
        if(value.length===1){   //为1时加载第二级菜单
            dispatch({
                type: "personalInfos/renderCityCascader",
                payload: {
                    "Country": "中国",
                    "Province": value[0]
                }
            })
        } else if (value.length === 2) { //为2时加载第三级菜单
            dispatch({
                type: "personalInfos/renderDistrictCascader",
                payload: {
                    "Country": "中国",
                    "Province": value[0],
                    "City": value[1]
                }
            })
        }
    }

    autoCompleteChange = (value) => {
        const { dispatch, personalInfos} = this.props;
        const { ticketsInfos } = personalInfos;
        if (value.length >= 3){
            dispatch({
                type: "personalInfos/companyStubHubGetting",
                payload: {
                    CompanyRegistraionName:value
                }
            })
        }
    }

    render() {
        const { IsHideList } = this.state;
        const { personalInfos } = this.props;
        const {intl} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { 
            disabled, 
            contactList, 
            visible, 
            ticketsDisabled, 
            currentUser, 
            industryArr, 
            promptObj, 
            cascaderOptions,
            autoCompleteData,
            avatarImg,
            industryOptions,
            ticketsInfos,
            // IsHideList
        } = personalInfos;
        const columns = [
            {
                title: <FormattedMessage id="event.content.order" />,
                key: (text, record, index) => {
                    return index + 1
                },
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: <FormattedMessage id="event.content.fullName" />,
                key: 'name',
                render: (text, record, index) => {
                    return record.FirstName + record.LastName
                }
            }, {
                title: <FormattedMessage id="event.manage.CompanyName" />,
                dataIndex: 'CompanyName',
                key: 'CompanyName',
            }, {
                title: <FormattedMessage id="event.manage.Position" />,
                dataIndex: 'JobTitle',
                key: 'JobTitle',
            }, {
                title: <FormattedMessage id="event.manage.Telephone" />,
                dataIndex: 'PhoneNumber',
                key: 'PhoneNumber',
            }, {
                title: <FormattedMessage id="event.manage.EMail" />,
                dataIndex: 'Email',
                key: 'Email',
            }, {
                title: <FormattedMessage id="event.manage.Industry" />,
                key: 'AddressDistrict',
                render: (text, record, index) => {
                    let value = "";
                    if (!!industryOptions && !!industryOptions.length){
                        industryOptions.map((item,index)=>{
                            if (item.value === record.CompanyIndustry){
                                value = item.label;
                            }
                        })
                    }
                    return value
                }
            }, {
                title: <FormattedMessage id="event.reg.action" />,
                render: (text, record, index) => {
                    return < a onClick={(e)=>{this.handleDelete(e,record.Email)}}> <Icon style={{fontSize:"20px"}} type="close-circle" theme="outlined" /></a>
                }
            }];
            
        return (
            <div>
                <Row>
                    <Col>
                        <AddContact 
                            addressOption={cascaderOptions} 
                            industryOptions={industryOptions} 
                            handleAddUser={this.handleUserSubmit} 
                            handleCancel={this.handleCancel} 
                            visible={visible}
                            intl={intl}
                            />
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{ marginTop: '10px' }}>
                        <SettingPanel icon={<Icon type="user" theme="outlined" />} title={intl.formatMessage({ id: 'event.content.User picture' })}>
                            <Row>
                                <div style={{float:'left'}}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}>
                                        <div className={styles.UploadImgD}>
                                            {IsHideList.avatar || !!avatarImg ? <img src={!!avatarImg ? avatarImg:IsHideList.avatar} alt="avatar" /> : <Icon type="plus" theme="outlined" />}
                                        </div>
                                    </Upload>
                                </div>
                                <div style={{ marginTop: "50px", float: 'left',marginLeft:'20px'}}>
                                    <p>{intl.formatMessage({ id: 'event.content.User picture details' })}</p>
                                </div>
                            </Row>
                        </SettingPanel>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{ marginTop: '10px' }}>
                        <SettingPanel icon={<Icon type="idcard" theme="outlined" />} title={intl.formatMessage({id:'event.content.Personal information Details'})} editImg={<a onClick={(e)=>{this.handleEditClick(e)}}><Icon type="form" theme="outlined" /></a>}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.fname' })}>
                                            {getFieldDecorator('FirstName', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.firstname" /> },
                                                ],
                                                initialValue: !!currentUser.FirstName ? currentUser.FirstName : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.lname' })}>
                                            {getFieldDecorator('LastName', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.lastname" /> },
                                                ],
                                                initialValue: !!currentUser.LastName ? currentUser.LastName : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.general.industry' })}>
                                            {getFieldDecorator('hangye', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.g.messageInd" /> },
                                                ],
                                                initialValue: !!currentUser && !!currentUser.CompanyIndustry && !!currentUser.CompanySector ? [currentUser.CompanyIndustry, currentUser.CompanySector]:[]
                                            })(
                                                <Cascader
                                                    options={industryOptions}
                                                    placeholder=""
                                                    disabled={disabled}
                                                    loadData={this.loadCascaderData}
                                                    // onChange={this.onIndustryChange}
                                                    changeOnSelect
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                {/* </Row>

                                <Row> */}
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.company' })}>
                                            {getFieldDecorator('CompanyName', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.companyName" /> },
                                                ],
                                                initialValue: !!currentUser.CompanyName ? currentUser.CompanyName : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.position' })}>
                                            {getFieldDecorator('JobTitle', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.position" /> },
                                                ],
                                                initialValue: !!currentUser.JobTitle ? currentUser.JobTitle : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.companyAddress' })}>
                                            {getFieldDecorator('Address', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.content.Company Address" /> },
                                                ],
                                                initialValue: [currentUser.CompanyProvince, currentUser.CompanyCity, currentUser.CompanyDistrict]
                                                //initialValue: this.initialAddress()
                                            })(
                                                <Cascader 
                                                    options={cascaderOptions} 
                                                    placeholder="" 
                                                    disabled={disabled} 
                                                    loadData={this.loadCascaderData}
                                                    // onChange={this.onCascaderChange}
                                                    // changeOnSelect
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                {/* </Row>

                                <Row> */}
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Detail Company Address' })}>
                                            {getFieldDecorator('DetailAddress', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.content.Detail Company Address" /> },
                                                ],
                                                initialValue: !!currentUser && !!currentUser.CompanyStreet ? currentUser.CompanyStreet : ""
                                            })(
                                                <Input disabled={disabled} />
                                            )}
                                        </FormItem>
                                    </Col>

                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.phone' })}>
                                            {getFieldDecorator('PhoneNumber', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.phone" /> },
                                                ],
                                                initialValue: !!currentUser.PhoneNumber ? currentUser.PhoneNumber : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.email' })}>
                                            {getFieldDecorator('Email', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.email" /> },
                                                ],
                                                initialValue: !!currentUser.Email ? currentUser.Email : ""
                                            })(
                                                <Input disabled={disabled}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                {/* </Row>
                                <Row> */}
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.companyPhone' })}>
                                            {getFieldDecorator('CompanyPhone', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.companyPhone" /> },
                                                ],
                                                initialValue: !!currentUser.CompanyPhone ? currentUser.CompanyPhone : ""
                                            })(
                                                <Input disabled={disabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.PersonalAddress' })}>
                                            {getFieldDecorator('PersonAddress', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.reg.PersonalAddress" /> },
                                                ],
                                                initialValue: [currentUser.PersonProvince, currentUser.PersonCity, currentUser.PersonDistrict]
                                            })(
                                                <Cascader
                                                    options={cascaderOptions}
                                                    placeholder=""
                                                    disabled={disabled}
                                                    loadData={this.loadCascaderData}
                                                />
                                            )}
                                        </FormItem>
                                    </Col> 
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Detail Personal Address' })}>
                                            {getFieldDecorator('DetailPersonAddress', {
                                                rules: [
                                                    { required: true, message: <FormattedMessage id="event.message.content.Detail Personal Address" /> },
                                                ],
                                                initialValue: !!currentUser && !!currentUser.PersonStreet ? currentUser.PersonStreet : ""
                                            })(
                                                <Input disabled={disabled} />
                                            )}
                                        </FormItem>
                                    </Col>                                                                       
                                </Row>
                                <FormItem {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" style={disabled?{display:"none"}:{display:"block"}}>
                                        {intl.formatMessage({ id: 'event.content.Save' })}
                                    </Button>
                                </FormItem>
                            </Form>
                        </SettingPanel>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{ marginTop: '10px' }}>
                        <SettingPanel icon={<Icon type="file-text" theme="outlined" />} title={intl.formatMessage({id:'event.content.Ticket information'})} editImg={<a onClick={(e) => { this.handleTicketsEditClick(e) }}><Icon type="form" theme="outlined" /></a>}>
                            <Form onSubmit={this.handleTicketsSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({id: 'event.content.Fapiao Name' })}>
                                            {getFieldDecorator('BizRegistraionName', {
                                                rules: [
                                                    { required: false, message: <FormattedMessage id="event.message.content.Fapiao Name" /> },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.BizRegistraionName ? ticketsInfos.BizRegistraionName : ""
                                            })(
                                                <AutoComplete 
                                                    disabled={ticketsDisabled} 
                                                    dataSource={autoCompleteData}
                                                    onChange={this.autoCompleteChange}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Duty Paragraph' })}>
                                            {getFieldDecorator('TaxPayerCode', {
                                                rules: [
                                                    { required: false, message: <FormattedMessage id="event.message.content.Duty Paragraph" /> },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.TaxPayerCode ? ticketsInfos.TaxPayerCode : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({id: 'event.content.Bank of Deposit' })}>
                                            {getFieldDecorator('BankName', {
                                                rules: [
                                                    { required: false, message: <FormattedMessage id="event.message.content.Bank of Deposit" /> },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.BankName ? ticketsInfos.BankName : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                {/* </Row> 
                                <Row> */}
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Bank Account Number' })}>
                                            {getFieldDecorator('BankAccount', {
                                                rules: [
                                                    { required: false, message: <FormattedMessage id="event.message.content.Bank Account Number" /> },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.BankAccount ? ticketsInfos.BankAccount : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({id: 'event.content.Company Address' })}>
                                            {getFieldDecorator('BizRegistraionAddress', {
                                                rules: [
                                                    { required: false, message: '请输入企业地址!' },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.BizRegistraionAddress ? ticketsInfos.BizRegistraionAddress : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Company Contact Number' })}>
                                            {getFieldDecorator('BizRegistraionPhoneNumber', {
                                                rules: [
                                                    { required: false, message: '请输入企业电话!' },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.PhoneNumber ? ticketsInfos.PhoneNumber : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                {/* </Row>
                                <Row> */}
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({id: 'event.content.Recepiant Name' })}>
                                            {getFieldDecorator('RecipientContact', {
                                                rules: [
                                                    { required: false, message: '请输入收件联系人!' },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.RecipientContact ? ticketsInfos.RecipientContact : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({id: 'event.content.Recepiant Contact Number' })}>
                                            {getFieldDecorator('RecipientContactPhone', {
                                                rules: [
                                                    { required: false, message: '请输入收件联系人电话!' },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.RecipientContactPhone ? ticketsInfos.RecipientContactPhone : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Recepiant Address' })}>
                                            {getFieldDecorator('RecipientAddress', {
                                                rules: [
                                                    { required: false, message: '请输入收件地址!' },
                                                ],
                                                initialValue: !!ticketsInfos && !!ticketsInfos.RecipientAddress ? ticketsInfos.RecipientAddress : ""
                                            })(
                                                <Input disabled={ticketsDisabled} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" style={ticketsDisabled ? { display: "none" } : { display: "block" }}>
                                        {intl.formatMessage({ id: 'event.content.Save' })}
                                    </Button>
                                </FormItem>   
                            </Form>
                        </SettingPanel>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{ marginTop: '10px' }}>
                        <SettingPanel icon={<Icon type="team" theme="outlined" />} title={intl.formatMessage({id:'event.content.Contact list'})}  editImg={<a onClick={(e) => { this.handleAddUser(e) }}><Icon type="user-add" theme="outlined" /></a>}>
                            <Table columns={columns} dataSource={!!contactList && contactList.length ? contactList : []} />
                        </SettingPanel>
                    </Col>  
                </Row>
            </div>
        );
    }
}
export default connect()(injectIntl(PersonalInfos));