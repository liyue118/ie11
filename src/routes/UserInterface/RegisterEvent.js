import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import { Row, Col, Icon, Form, Input, Select, Card, Menu, Dropdown, Button, Modal, Cascader} from 'antd';
import QRCode from 'qrcode.react';
import { formatMessage,injectIntl,intlShape } from 'react-intl';
import styles from './RegisterEvent.less'
import txlSvg from '../../assets/通讯录.svg'
import zySvg from '../../assets/注意.svg'
import { getCookie } from '../../utils/utils';
import UserFooter from '../../components/UserFooter';
import DePanel from '../../components/DePanel';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
}
@connect(({ registerEvent, loading }) => ({ //连接modal
    registerEvent,
}))
@Form.create()
class RegisterEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sk: getCookie("sk") != null ? getCookie("sk") : ''
        }
        
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch, registerEvent} = this.props;
        const { currentEvent } = registerEvent;
        const EventId = currentEvent.Id;
        this.props.form.validateFields((err, values) => {
            let arr=[];
            let valueObj={}; 
            if (!err) {
                if (!!values && !!values.AttendeeCount && !!EventId){
                    for (let i = 1; i <= values.AttendeeCount ; i++){
                        let a ={};
                        for (let key in values) {
                            if (key.indexOf(i)!==-1){
                                let newKey = key.substr(0, key.length - 1);
                                if (newKey ==="CompanyAddress"){
                                    a['AddressCountry'] = "中国";
                                    if (!!values&&!!values[key]){
                                        a['AddressProvince'] = values[key][0];
                                        a['AddressCity'] = values[key][1];
                                        a['AddressDistrict'] = values[key][2];
                                    }else{
                                        a['AddressProvince'] = '';
                                        a['AddressCity'] = '';
                                        a['AddressDistrict'] = '';
                                    }
                                }else{
                                    a[newKey] = values[key]
                                }
                                if (newKey === "Industry" && !!values[key] && values[key].length===2){
                                    a['Industry'] = values[key][0];
                                    a['Sector'] = values[key][1];
                                } else if (newKey === "Industry" && !!values[key] && values[key].length === 1){
                                    a['Industry'] = values[key][0];
                                    a['Sector'] = "";
                                }
                            }
                        }
                        arr.push(a)
                    }
                    valueObj["AttendeePersonInfo"] = arr;

                    if (!!values.CompanyAddress && values.CompanyAddress){
                        valueObj["ContactorInfo"] = {
                            "CompanyName": values.CompanyName,
                            "JobTitle": values.JobTitle,
                            "FirstName": values.FirstName,
                            "LastName": values.LastName,
                            "PhoneNumber": values.PhoneNumber,
                            "Email": values.Email,
                            "CompanyPhone": values.CompanyPhone,
                            "AddressCountry": "中国",   //写死的国家 目前只支持中国
                            "AddressProvince": values.CompanyAddress[0],   
                            "AddressCity": values.CompanyAddress[1], 
                            "AddressDistrict": values.CompanyAddress[2],
                            "Street": values.Street,
                        };
                        if (!!values.Industry && !!values.Industry.length===2){
                            valueObj["ContactorInfo"].Sector = values.Industry[1];
                            valueObj["ContactorInfo"].Industry = values.Industry[0];
                        } else if (!!values.Industry && !!values.Industry.length === 1){
                            valueObj["ContactorInfo"].Sector = '';
                            valueObj["ContactorInfo"].Industry = values.Industry[0];
                        }
                    }else{
                        valueObj["ContactorInfo"] = {
                            "CompanyName": values.CompanyName,
                            // "JobTitle": !!values.JobTitle ? values.JobTitle : "",
                            "FirstName": values.FirstName,
                            "LastName": values.LastName,
                            "PhoneNumber": values.PhoneNumber,
                            "Email": values.Email,
                            "CustomFieldValue": values.CustomFieldValue,
                            // "CompanyPhone": !!values.CompanyPhone ? values.CompanyPhone:"",
                            // "AddressCountry": !!values.CompanyAddress ? "中国":"",   //写死的国家 目前只支持中国
                            // "Street": !!values.Street ? values.Street : "",
                        };
                        if (!!values.Street){
                            valueObj['Street'] = values.Street;
                        }
                        if (!!values.CompanyAddress){
                            valueObj['AddressCountry'] = "中国";
                        }
                        if (!!values.CompanyPhone){
                            valueObj['CompanyPhone'] = values.CompanyPhone;
                        }
                        if (!!values.JobTitle){
                            valueObj['JobTitle'] = values.JobTitle;
                        }
                        if (!!values.Industry && !!values.Industry.length === 2) {
                            valueObj["ContactorInfo"].Sector = values.Industry[1];
                            valueObj["ContactorInfo"].Industry = values.Industry[0];
                        } else if (!!values.Industry && !!values.Industry.length === 1) {
                            valueObj["ContactorInfo"].Industry = values.Industry[0];
                        }
                    }
                    valueObj["AttendeeCount"] = values.AttendeeCount;
                    valueObj["PaymentType"] = values.PaymentType;
                    valueObj["EventId"] = EventId;
                    console.log('valueObj', valueObj)
                    dispatch({
                        type:"registerEvent/eventAttendeeSettings",
                        payload:valueObj
                    })
                }
            }
        });
    }

    handleMenu1Click = (item) => {   //点击 参与者信息 右边向下箭头 默认填充当前选中联系人信息
        const { registerEvent } = this.props;
        const { setFieldsValue, getFieldDecorator } = this.props.form;
        const { contactList, currentUserInfo} = registerEvent; 
        const num = item.key.substr(item.key.length - 1, 1)
        const key = item.key.substr(0,item.key.length - 1)
        const resetValue = {};
        contactList.map((i,index)=>{
            if (i.Email===key){
                const CompanyName = `CompanyName${num}`;
                const Email = `Email${num}`;
                const FirstName = `FirstName${num}`;
                const JobTitle = `JobTitle${num}`;
                const LastName = `LastName${num}`;
                const PhoneNumber = `PhoneNumber${num}`;

                const CompanyPhone = `CompanyPhone${num}`;
                const CompanyAddress = `CompanyAddress${num}`;
                const Street = `Street${num}`;
                const Industry = `Industry${num}`;

                resetValue[CompanyName] = i.CompanyName;
                resetValue[Email] = i.Email;
                resetValue[FirstName] = i.FirstName;
                resetValue[JobTitle] = i.JobTitle;
                resetValue[LastName] = i.LastName;
                resetValue[PhoneNumber] = i.PhoneNumber;

                resetValue[CompanyPhone] = i.CompanyPhone;
                resetValue[CompanyAddress] = [i.CompanyProvince, i.CompanyCity, i.CompanyDistrict];
                resetValue[Street] = i.CompanyStreet;

                if (!!currentUserInfo.CompanySector) {
                    resetValue[Industry] = [i.CompanyIndustry, i.CompanySector];
                } else {
                    resetValue[Industry] = [i.CompanyIndustry, ''];
                }
                setFieldsValue(resetValue);
            }
        })
        if (key === "myInfo" && !!currentUserInfo.Email){
            const CompanyName = `CompanyName${num}`;
            const Email = `Email${num}`;
            const FirstName = `FirstName${num}`;
            const JobTitle = `JobTitle${num}`;
            const LastName = `LastName${num}`;
            const PhoneNumber = `PhoneNumber${num}`;
            const CompanyPhone = `CompanyPhone${num}`;
            const CompanyAddress = `CompanyAddress${num}`;
            const Street = `Street${num}`;
            const Industry = `Industry${num}`;
            resetValue[CompanyName] = currentUserInfo.CompanyName;
            resetValue[Email] = currentUserInfo.Email;
            resetValue[FirstName] = currentUserInfo.FirstName;
            resetValue[JobTitle] = currentUserInfo.JobTitle;
            resetValue[LastName] = currentUserInfo.LastName;
            resetValue[PhoneNumber] = currentUserInfo.PhoneNumber;
            resetValue[CompanyPhone] = currentUserInfo.CompanyPhone;
            resetValue[CompanyAddress] = [currentUserInfo.CompanyProvince, currentUserInfo.CompanyCity, currentUserInfo.CompanyDistrict];
            resetValue[Street] = currentUserInfo.CompanyStreet;
            if (!!currentUserInfo.CompanySector){
                resetValue[Industry] = [currentUserInfo.CompanyIndustry, currentUserInfo.CompanySector];
            }else{
                resetValue[Industry] = [currentUserInfo.CompanyIndustry, ''];
            }
            document.getElementById(`Contactor${num}`).innerHTML = currentUserInfo.LastName + currentUserInfo.FirstName;
            document.getElementById(`CompanyName${num}`).disabled = !!currentUserInfo.CompanyName?true:false;
            document.getElementById(`Email${num}`).disabled = !!currentUserInfo.Email ? true : false;
            document.getElementById(`FirstName${num}`).disabled = !!currentUserInfo.FirstName ? true : false;
            document.getElementById(`LastName${num}`).disabled = !!currentUserInfo.LastName ? true : false;
            document.getElementById(`PhoneNumber${num}`).disabled = !!currentUserInfo.PhoneNumber ? true : false;
            if (!!document.getElementById(`CompanyPhone${num}`)){
                document.getElementById(`CompanyPhone${num}`).disabled = !!currentUserInfo.CompanyPhone ? true : false;
            }
            if (!!document.getElementById(`Industry${num}`)){
                document.getElementById(`Industry${num}`).disabled = !!currentUserInfo.CompanyIndustry ? true : false;
            }
            if (!!document.getElementById(`CompanyAddress${num}`)){
                document.getElementById(`CompanyAddress${num}`).disabled = !!currentUserInfo.CompanyProvince && !!currentUserInfo.CompanyCity && !!currentUserInfo.CompanyDistrict ? true : false;
            }
            if (!!document.getElementById(`JobTitle${num}`)){
                document.getElementById(`JobTitle${num}`).disabled = !!currentUserInfo.JobTitle ? true : false;
            }
            if (!!document.getElementById(`Street${num}`)){
                document.getElementById(`Street${num}`).disabled = !!currentUserInfo.CompanyStreet ? true : false;
            }
            setFieldsValue(resetValue);
        } else if (key === "otherInfo"){
            const CompanyName = `CompanyName${num}`;
            const Email = `Email${num}`;
            const FirstName = `FirstName${num}`;
            const JobTitle = `JobTitle${num}`;
            const LastName = `LastName${num}`;
            const PhoneNumber = `PhoneNumber${num}`;

            const CompanyPhone = `CompanyPhone${num}`;
            const CompanyAddress = `CompanyAddress${num}`;
            const Street = `Street${num}`;
            const Industry = `Industry${num}`;

            document.getElementById(`Contactor${num}`).innerHTML = '其他';

            resetValue[CompanyName] = "";
            resetValue[Email] = "";
            resetValue[FirstName] = "";
            resetValue[JobTitle] = "";
            resetValue[LastName] = "";
            resetValue[PhoneNumber] = "";

            resetValue[CompanyPhone] = "";
            resetValue[CompanyAddress] = "";
            resetValue[Street] = "";
            resetValue[Industry] = "";
            document.getElementById(`CompanyName${num}`).disabled =false;
            document.getElementById(`Email${num}`).disabled =false;
            document.getElementById(`FirstName${num}`).disabled =false;
            document.getElementById(`LastName${num}`).disabled = false;
            document.getElementById(`PhoneNumber${num}`).disabled = false;
            
            if (!!document.getElementById(`CompanyPhone${num}`)) {
                document.getElementById(`CompanyPhone${num}`).disabled = false;
            }
            if (!!document.getElementById(`Industry${num}`)) {
                document.getElementById(`Industry${num}`).disabled = false;
            }
            if (!!document.getElementById(`CompanyAddress${num}`)) {
                document.getElementById(`CompanyAddress${num}`).disabled = false;
            }
            if (!!document.getElementById(`JobTitle${num}`)) {
                document.getElementById(`JobTitle${num}`).disabled = false;
            }
            if (!!document.getElementById(`Street${num}`)) {
                document.getElementById(`Street${num}`).disabled = false;
            }
            setFieldsValue(resetValue);
        }
    }

    handleMenu2Click = (item) => {  //点击经济联系人 右边向下箭头 默认填充当前选中联系人信息
        const { registerEvent } = this.props;
        const { setFieldsValue } = this.props.form;
        const { currentUserInfo } = registerEvent; 
        const key = item.key;
        if (key === "myInfo" && !!currentUserInfo.Email) {
            document.getElementById(`Contactor`).innerHTML = currentUserInfo.FirstName + currentUserInfo.LastName;
            document.getElementById(`CompanyName`).disabled = !!currentUserInfo.CompanyName ? true : false;
            document.getElementById(`Email`).disabled = !!currentUserInfo.Email ? true : false;
            document.getElementById(`FirstName`).disabled = !!currentUserInfo.FirstName ? true : false;
            // 
            document.getElementById(`LastName`).disabled = !!currentUserInfo.LastName ? true : false;
            document.getElementById(`PhoneNumber`).disabled = !!currentUserInfo.PhoneNumber ? true : false;
            // 
            // 
            // 
            // 
            if (!!document.getElementById(`CompanyPhone`)) {
                document.getElementById(`CompanyPhone`).disabled = !!currentUserInfo.CompanyPhone ? true : false;
            }
            if (!!document.getElementById(`Industry`)) {
                document.getElementById(`Industry`).disabled = !!currentUserInfo.CompanyIndustry ? true : false;
            }
            if (!!document.getElementById(`CompanyAddress`)) {
                document.getElementById(`CompanyAddress`).disabled = !!currentUserInfo.CompanyProvince && !!currentUserInfo.CompanyCity && !!currentUserInfo.CompanyDistrict ? true : false;
            }
            if (!!document.getElementById(`JobTitle`)) {
                document.getElementById(`JobTitle`).disabled = !!currentUserInfo.JobTitle ? true : false;
            }
            if (!!document.getElementById(`Street`)) {
                document.getElementById(`Street`).disabled = !!currentUserInfo.CompanyStreet ? true : false;
            }
            setFieldsValue({
                CompanyName: currentUserInfo.CompanyName,
                Email: currentUserInfo.Email,
                FirstName: currentUserInfo.FirstName,
                JobTitle: currentUserInfo.JobTitle,
                LastName: currentUserInfo.LastName,
                PhoneNumber: currentUserInfo.PhoneNumber,
                CompanyPhone: currentUserInfo.CompanyPhone,
                CompanyAddress: [currentUserInfo.CompanyProvince, currentUserInfo.CompanyCity, currentUserInfo.CompanyDistrict],
                Street: currentUserInfo.CompanyStreet,
                Industry: [currentUserInfo.CompanyIndustry, currentUserInfo.CompanySector]
            });
        } else if (key === "otherInfo") {
            document.getElementById(`Contactor`).innerHTML = '其他';
            document.getElementById(`CompanyName`).disabled = false;
            document.getElementById(`Email`).disabled = false;
            document.getElementById(`FirstName`).disabled = false;
            document.getElementById(`LastName`).disabled = false;
            document.getElementById(`PhoneNumber`).disabled = false;
            
            if (!!document.getElementById(`CompanyPhone`)) {
                document.getElementById(`CompanyPhone`).disabled = false;
            }
            if (!!document.getElementById(`Industry`)) {
                document.getElementById(`Industry`).disabled = false;   
            }
            if (!!document.getElementById(`CompanyAddress`)) {
                document.getElementById(`CompanyAddress`).disabled = false;
            }
            if (!!document.getElementById(`JobTitle`)) {
                document.getElementById(`JobTitle`).disabled = false;
            }
            if (!!document.getElementById(`Street`)) {
                document.getElementById(`Street`).disabled = false;
            }         
            setFieldsValue({
                CompanyName: "",
                Email: "",
                FirstName: "",
                JobTitle: "",
                LastName: "",
                PhoneNumber: "",
                CompanyPhone: "",   
                CompanyAddress: "",
                Street: "",
                Industry: "",
            });
        }
    }

    renderMenu = (contactList, i) => {
        return(
            <div>
                {contactList.length ? 
                    <Menu onClick={this.handleMenu1Click} className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical addMenu"> 
                        <Menu.Item key={`myInfo${i}`}><a>使用我的账户信息</a></Menu.Item>
                        {contactList.map((item, index) => {
                            if(item==="1"){
                                return
                            }else{
                                return (
                                    <Menu.Item key={`${item.Email}${i}`}><a>{`${item.FirstName}${item.LastName}`}</a></Menu.Item>
                                )
                            }
                        })
                        }
                        <Menu.Item key={`otherInfo${i}`}><a>其他</a></Menu.Item>
                    </Menu>
                : 
                    <Menu onClick={this.handleMenu1Click} className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical addMenu">
                        <Menu.Item key={`myInfo`}><a>使用我的账户信息</a></Menu.Item>
                        <Menu.Item key={`otherInfo`}><a>其他</a></Menu.Item>
                    </Menu>
                }
            </div>
        )
    }

    loadCascaderData = (selectedOptions) => { }

    onCascaderChange = (value, selectedOptions) => {    //级联菜单onChange事件
        const { dispatch } = this.props;
        if (value.length === 1) {   //为1时加载第二级菜单
            dispatch({
                type: "registerEvent/renderCityCascader",
                payload: {
                    "Country": "中国",
                    "Province": value[0]
                }
            })
        } else if (value.length === 2) { //为2时加载第三级菜单
            dispatch({
                type: "registerEvent/renderDistrictCascader",
                payload: {
                    "Country": "中国",
                    "Province": value[0],
                    "City": value[1]
                }
            })
        }
    }
    participantsInfos = (participantsNum, getFieldDecorator, contactList, participantInfo, showOrHiddenObj) => {
        const { registerEvent } = this.props;
        const { cascaderOptions, industryOptions  } = registerEvent;
        var cardList=[];
        const obj = JSON.stringify(showOrHiddenObj);
        const {sk} = this.state;
        if (participantsNum>0){
            for (let i = 1; i <= participantsNum;i++){
                cardList.push(
                    <Card 
                        key={i}
                        title={`参与者信息${i}`} 
                        className={styles.card}
                        extra={
                            !!sk ? <Dropdown overlay={this.renderMenu(contactList, i)}>
                                <a className="ant-dropdown-link">
                                    <span id={`Contactor${i}`}>选择联系人</span><Icon type="down" />
                                </a>
                            </Dropdown>
                            :
                            ''
                        }
                        >
                        <Col span={12}>
                            <FormItem wrappedComponentRef={`CompanyName${i}`} {...formItemLayout1} label="公司">
                                {getFieldDecorator(`CompanyName${i}`, {
                                    rules: [
                                        { required: true, message: '请填写公司名称!' },
                                    ],
                                    //initialValue: !!participantInfo.CompanyName ? participantInfo.CompanyName:""
                                })(<Input/>)}
                            </FormItem>
                        </Col>
                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.JobTitle ? 
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`JobTitle${i}`} {...formItemLayout1} label="职位">
                                        {getFieldDecorator(`JobTitle${i}`, {
                                            rules: [
                                                { required: true, message: '请填写职位名称!' },
                                            ],
                                            //initialValue: ""
                                        })(<Input />)}
                                    </FormItem>
                                </Col>
                            :
                                ""
                        }
                        <Col span={12}>
                            <FormItem wrappedComponentRef={`FirstName${i}`} {...formItemLayout1} label="姓">
                                {getFieldDecorator(`FirstName${i}`, {
                                    rules: [
                                        { required: true, message: '请填写姓!' },
                                    ],
                                    //initialValue: ""
                                })(<Input />)}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem wrappedComponentRef={`LastName${i}`} {...formItemLayout1} label="名">
                                {getFieldDecorator(`LastName${i}`, {
                                    rules: [
                                        { required: true, message: '请填写名!' },
                                    ],
                                    //initialValue: ""
                                })(<Input />)}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem wrappedComponentRef={`PhoneNumber${i}`} {...formItemLayout1} label="电话">
                                {getFieldDecorator(`PhoneNumber${i}`, {
                                    rules: [
                                        { required: true, message: '请填写电话!' },
                                    ],
                                    //initialValue: ""
                                })(<Input />)}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem wrappedComponentRef={`Email${i}`} {...formItemLayout1} label="邮箱">
                                {getFieldDecorator(`Email${i}`, {
                                    rules: [
                                        { required: true, message: '请填写邮箱!' },
                                    ],
                                    //initialValue: ""
                                })(<Input />)}
                            </FormItem>
                        </Col>  

                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyPhone ?
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`CompanyPhone${i}`} {...formItemLayout1} label="公司电话">
                                        {getFieldDecorator(`CompanyPhone${i}`, {
                                            rules: [
                                                { required: true, message: '请选择公司电话!' },
                                            ],
                                            //initialValue: ""
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            :
                                ""
                        }            

                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyAddress ?
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`CompanyAddress${i}`} {...formItemLayout1} label="公司地址">
                                        {getFieldDecorator(`CompanyAddress${i}`, {
                                            rules: [
                                                { required: true, message: '请选择公司地址!' },
                                            ],
                                            //initialValue: currentEvent.Title
                                        })(
                                            <Cascader
                                                options={cascaderOptions}
                                                placeholder=""
                                                loadData={this.loadCascaderData}
                                                onChange={this.onCascaderChange}
                                                // changeOnSelect
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            :
                                ""
                        }

                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyAddress ?
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`Street${i}`} {...formItemLayout1} label="公司详细地址">
                                        {getFieldDecorator(`Street${i}`, {
                                            rules: [
                                                { required: true, message: '请填写公司详细地址!' },
                                            ],
                                            //initialValue: currentEvent.Title
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            :
                                ""
                        }
                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyIndustry ?
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`Industry${i}`} {...formItemLayout1} label="所属行业">
                                        {getFieldDecorator(`Industry${i}`, {
                                            rules: [
                                                { required: true, message: '请选择所属行业!' },
                                            ],
                                            //initialValue: currentEvent.Title
                                        })(
                                            < Cascader
                                                options = { industryOptions }
                                                placeholder = ""
                                                changeOnSelect
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            :
                                showOrHiddenObj === null ?
                                    <Col span={12}>
                                        <FormItem wrappedComponentRef={`Industry${i}`} {...formItemLayout1} label="所属行业">
                                            {getFieldDecorator(`Industry${i}`, {
                                                rules: [
                                                    { required: true, message: '请选择所属行业!' },
                                                ],
                                                //initialValue: currentEvent.Title
                                            })(
                                                < Cascader
                                                    options={industryOptions}
                                                    placeholder=""
                                                    changeOnSelect
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    :
                                    ""
                        } 
                        {
                            obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CustomField ?
                                <Col span={12}>
                                    <FormItem wrappedComponentRef={`CustomFieldValue${i}`} {...formItemLayout1} label={showOrHiddenObj.CustomFieldLabel}>
                                        {getFieldDecorator(`CustomFieldValue${i}`, {
                                            rules: [
                                                { required: true, message: `请填写${showOrHiddenObj.CustomFieldLabel}!` },
                                            ],
                                            //initialValue: currentEvent.Title
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                :
                                ""
                        }                
                    </Card>
                )
            }
        }
        return cardList;
    }

    participantsNumChange = (value) => {
        const { dispatch, registerEvent} = this.props;
        const { participantsNum } = registerEvent;
        if (participantsNum!==value){
            dispatch({
                type: "registerEvent/participantsNumChange",
                payload:{
                    participantsNum:value
                }
            })
        }
    }

    renderOption = (ticketLimit) => {
        const optionList=[];
        if (!!ticketLimit){
            for (let i = 1; i <= ticketLimit ; i++){
                optionList.push(<Option key={i} value={i}>{i}</Option>)
            }
        }
        return optionList;
    }

    renderPaymentType = () => {
        const { registerEvent } = this.props;
        const { transactionTypeDropdownList } = registerEvent;
        const optionList = [];
        if (!!transactionTypeDropdownList && transactionTypeDropdownList.length) {
            for (let i = 0; i <= transactionTypeDropdownList.length-1; i++) {
                optionList.push(<Option key={i} value={transactionTypeDropdownList[i].Key}>{transactionTypeDropdownList[i].Value}</Option>)
            }
        }
        return optionList;
    }

    handleOk = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type:"registerEvent/changeVisible",
            payload:{
                modalVisible: false
            }
        })
    }
    
    handleCancel = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type:"registerEvent/changeVisible",
            payload:{
                modalVisible: false
            }
        })
        this.props.dispatch(routerRedux.push({
            pathname: '/userInterface/userIndex',
        }));
    }

    qrCodeLinkClick = (e) => {
        console.log('e',e)
    }

    linkToMyEvent = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: "registerEvent/changeVisible",
            payload: {
                modalVisible: false
            }
        })
        this.props.dispatch(routerRedux.push({
            pathname: '/userInterface/userIndex',
            state: {
                showMyEvent: 'showMyEvent',
            }
        }));
    }
    linkToHome = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: "registerEvent/changeVisible",
            payload: {
                modalVisible: false
            }
        })
        this.props.dispatch(routerRedux.push({
            pathname: '/user/login'
        }));
    }

    render() {
        const { registerEvent } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { intl } = this.props;
        const { 
            registerObj, 
            modalVisible, 
            currentEvent, 
            participantsNum, 
            ticketLimit, 
            contactList, 
            participantInfo, 
            currentUserInfo,
            showOrHiddenObj,
            cascaderOptions,
            industryOptions,
        } = registerEvent;
        const {sk} = this.state;
        const eventId = currentEvent.Id;
        const obj = JSON.stringify(showOrHiddenObj);
        return (
            <div style={{ backgroundColor:"#FBFBFB"}}>
                <Row>
                    <div >
                        <Modal 
                            width="600"
                            title={
                                <Row>
                                    <Col><h2>{intl.formatMessage({id:'event.content.Congratulations'})}</h2></Col>
                                    <Col>{registerObj.EventName}</Col>
                                </Row>
                                }
                            wrapClassName='registBackModal'
                            // visible={true}
                            visible={modalVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            <p>
                                <span>{intl.formatMessage({id:'event.content.After approval'})}</span>
                            </p>
                            <QRCode size={150} value={!!registerObj.EventId ? registerObj.EventId:"1234"} />
                            <p>
                                <a onClick={(e) => { this.qrCodeLinkClick(e)}}>扫描二维码进入微信小程序，随时查看详情！</a>
                            </p>
                            <Row>
                                <Col offset={1}>
                                    <div>
                                        {registerObj.StartDate} {registerObj.StartTime} 至 {registerObj.EndDate} {registerObj.EndTime} 
                                    </div>
                                </Col>
                                <Col offset={1}>
                                    <div>
                                        <div>{registerObj.VenueName}</div>
                                        <div>{registerObj.EventLocation}</div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <div style={{textAlign:"center",marginTop:"30px"}}>
                                    {!!sk
                                    ?
                                        <Button onClick={this.linkToMyEvent} type="primary">跳转到我的活动</Button>
                                    :
                                        <Button onClick={this.linkToHome} type="primary">跳转到登录页</Button>
                                    }
                                    
                                </div>
                            </Row>
                        </Modal>
                    </div>
                </Row>
                <Row>
                    <h2 className={styles.title}>
                        {`${currentEvent.Title}`}
                    </h2>
                </Row>
                <Row>
                    <Col span={21} offset={3}>
                        <div className={styles.tips}>
                            <Icon type="exclamation-circle-o"/>
                            <span>{intl.formatMessage({id:'event.content.ReTips'})}</span>
                            {/* <a className={styles.contactUs} href="#">联系我们！</a> */}
                        </div>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={20} offset={2}>
                            <DePanel title={intl.formatMessage({id:'event.content.Ticket information'})} num="1">
                                <FormItem {...formItemLayout} label="门票名称">
                                    {getFieldDecorator('tiketName', {
                                        rules: [
                                            { required: true, message: '请选择门票名称!' },
                                        ],
                                        initialValue: currentEvent.Title
                                    })(
                                        <Input disabled/>
                                    )}
                                    
                                </FormItem>

                                <FormItem {...formItemLayout} label="参会人数">
                                    {getFieldDecorator('AttendeeCount', {
                                        rules: [
                                            { required: true, message: '请选择参会人数!' },
                                        ],
                                        initialValue: `${participantsNum}`
                                    })(
                                        <Select onChange={this.participantsNumChange}>
                                            {this.renderOption(ticketLimit)}
                                        </Select>
                                        )}
                                    
                                </FormItem>
                                <FormItem {...formItemLayout} label="付款方式">
                                    {getFieldDecorator('PaymentType', {
                                        rules: [
                                            { required: true, message: '请选择付款方式!' },
                                        ],
                                        initialValue: "1005003"
                                    })(
                                        <Select>
                                            {this.renderPaymentType()}
                                        </Select>
                                        )}
                                </FormItem>
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <DePanel title={intl.formatMessage({id:'event.content.Participant information'})} num="2">
                                {
                                    this.participantsInfos(participantsNum, getFieldDecorator, contactList, participantInfo, showOrHiddenObj)
                                }
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <DePanel title={intl.formatMessage({id:'event.content.Contact information'})} num="3">
                                <Card
                                    title='选择联系方式'
                                    className={styles.card}
                                    extra={
                                        !!sk?
                                            <Dropdown overlay={
                                                <Menu onClick={this.handleMenu2Click}>
                                                    <Menu.Item key="myInfo">
                                                        <a>使用我的账户信息</a>
                                                    </Menu.Item>
                                                    <Menu.Item key="otherInfo">
                                                        <a>其他</a>
                                                    </Menu.Item>
                                                </Menu>}>
                                                <a className="ant-dropdown-link">
                                                    <span id='Contactor'>选择联系人</span><Icon type="down" />
                                                </a>
                                            </Dropdown>
                                            :
                                            ""
                                    }
                                >
                                    <Col span={12}>
                                        <FormItem {...formItemLayout1} label="公司">
                                            {getFieldDecorator('CompanyName', {
                                                rules: [
                                                    { required: true, message: '请填写公司名称!' },
                                                ],
                                                //initialValue: ""
                                            })(<Input />)}
                                        </FormItem>
                                    </Col>
                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.JobTitle ?
                                            <Col span={12}>
                                                <FormItem {...formItemLayout1} label="职位">
                                                    {getFieldDecorator(`JobTitle`, {
                                                        rules: [
                                                            { required: true, message: '请填写职位名称!' },
                                                        ],
                                                        //initialValue: ""
                                                    })(<Input />)}
                                                </FormItem>
                                            </Col>
                                            :
                                            ""
                                    }

                                    <Col span={12}>
                                        <FormItem {...formItemLayout1} label="姓">
                                            {getFieldDecorator('FirstName', {
                                                rules: [
                                                    { required: true, message: '请填写姓!' },
                                                ],
                                                //initialValue: ""
                                            })(<Input />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout1} label="名">
                                            {getFieldDecorator('LastName', {
                                                rules: [
                                                    { required: true, message: '请填写名!' },
                                                ],
                                                //initialValue: ""
                                            })(<Input />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout1} label="电话">
                                            {getFieldDecorator('PhoneNumber', {
                                                rules: [
                                                    { required: true, message: '请填写电话!' },
                                                ],
                                                //initialValue: ""
                                            })(<Input />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout1} label="邮箱">
                                            {getFieldDecorator('Email', {
                                                rules: [
                                                    { required: true, message: '请填写邮箱!' },
                                                ],
                                                //initialValue: ""
                                            })(<Input />)}
                                        </FormItem>
                                    </Col>

                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyPhone ?
                                            <Col span={12}>
                                                <FormItem {...formItemLayout1} label="公司电话">
                                                    {getFieldDecorator(`CompanyPhone`, {
                                                        rules: [
                                                            { required: true, message: '请选择公司电话!' },
                                                        ],
                                                        //initialValue: ""
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            :
                                            ""
                                    }

                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyAddress ?
                                            <Col span={12}>
                                                <FormItem {...formItemLayout1} label="公司地址">
                                                    {getFieldDecorator(`CompanyAddress`, {
                                                        rules: [
                                                            { required: true, message: '请选择公司地址!' },
                                                        ],
                                                        //initialValue: currentEvent.Title
                                                    })(
                                                        <Cascader
                                                            options={cascaderOptions}
                                                            placeholder=""
                                                            loadData={this.loadCascaderData}
                                                            onChange={this.onCascaderChange}
                                                            // changeOnSelect
                                                        />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            :
                                            ""
                                    }

                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyAddress ?
                                            <Col span={12}>
                                                <FormItem {...formItemLayout1} label="公司详细地址">
                                                    {getFieldDecorator(`Street`, {
                                                        rules: [
                                                            { required: true, message: '请填写公司详细地址!' },
                                                        ],
                                                        //initialValue: currentEvent.Title
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            :
                                            ""
                                    }

                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CompanyIndustry ?
                                            <Col span={12}>
                                                <FormItem {...formItemLayout1} label="所属行业">
                                                    {getFieldDecorator(`Industry`, {
                                                        rules: [
                                                            { required: true, message: '请选择所属行业!' },
                                                        ],
                                                        //initialValue: currentEvent.Title
                                                    })(
                                                        < Cascader
                                                            options={industryOptions}
                                                            placeholder=""
                                                            changeOnSelect
                                                        />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            :
                                            showOrHiddenObj===null?
                                                <Col span={12}>
                                                    <FormItem {...formItemLayout1} label="所属行业">
                                                        {getFieldDecorator(`Industry`, {
                                                            rules: [
                                                                { required: true, message: '请选择所属行业!' },
                                                            ],
                                                            //initialValue: currentEvent.Title
                                                        })(
                                                            < Cascader
                                                                options={industryOptions}
                                                                placeholder=""
                                                                changeOnSelect
                                                            />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                :
                                                ""
                                    } 
                                    {
                                        obj !== "{}" && !!showOrHiddenObj && showOrHiddenObj.CustomField ?
                                            <Col span={12}>
                                                <FormItem wrappedComponentRef={`CustomFieldValue`} {...formItemLayout1} label={showOrHiddenObj.CustomFieldLabel}>
                                                    {getFieldDecorator(`CustomFieldValue`, {
                                                        rules: [
                                                            { required: true, message: `请填写${showOrHiddenObj.CustomFieldLabel}!` },
                                                        ],
                                                        //initialValue: currentEvent.Title
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            :
                                            ""
                                    }
                                </Card>                                
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem style={{textAlign:'center'}}>
                                <Button 
                                    style={{ marginBottom: "50px" }} 
                                    type="defalut" 
                                    htmlType="submit" 
                                    size="large">
                                    提交注册
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <UserFooter intl={intl}></UserFooter>
            </div>
        );
    }
}
export default connect()(injectIntl(RegisterEvent));