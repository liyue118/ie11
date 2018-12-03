import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import { Row, Col, Icon, Form, Input, Select, Card, Menu, Dropdown, Button, Modal} from 'antd';
import QRCode from 'qrcode.react';
import styles from './RegisterEvent.less'
import txlSvg from '../../assets/通讯录.svg'
import zySvg from '../../assets/注意.svg'
import UserFooter from '../../components/UserFooter';
import DePanel from '../../components/DePanel';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
    },
};
const formItemLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15 },
}
@connect(({ registerEvent, loading }) => ({ //连接modal
    registerEvent,
}))
@Form.create()
export default class RegisterEvent extends Component {

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
                            debugger
                            if (key.indexOf(i)!==-1){
                                let newKey = key.substr(0, key.length - 1);  
                                a[newKey] = values[key]
                            }
                        }
                        arr.push(a)
                    }
                    valueObj["AttendeePersonInfo"] = arr;
                    valueObj["ContactorInfo"] = {
                        "CompanyName": values.CompanyName,
                        "JobTitle": values.JobTitle,
                        "FirstName": values.FirstName,
                        "LastName": values.LastName,
                        "PhoneNumber": values.PhoneNumber,
                        "Email": values.Email,
                    };
                    valueObj["AttendeeCount"] = values.AttendeeCount;
                    valueObj["EventId"] = EventId;

                    dispatch({
                        type:"registerEvent/eventAttendeeSettings",
                        payload:valueObj
                    })
                }
            }
        });
    }

    handleMenu1Click = (item) => {   //点击右边向下箭头 默认填充当前选中联系人信息
        const { registerEvent } = this.props;
        const { setFieldsValue } = this.props.form;
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

                resetValue[CompanyName] = i.CompanyName;
                resetValue[Email] = i.Email;
                resetValue[FirstName] = i.FirstName;
                resetValue[JobTitle] = i.JobTitle;
                resetValue[LastName] = i.LastName;
                resetValue[PhoneNumber] = i.PhoneNumber;
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

            resetValue[CompanyName] = currentUserInfo.CompanyName;
            resetValue[Email] = currentUserInfo.Email;
            resetValue[FirstName] = currentUserInfo.FirstName;
            resetValue[JobTitle] = currentUserInfo.JobTitle;
            resetValue[LastName] = currentUserInfo.LastName;
            resetValue[PhoneNumber] = currentUserInfo.PhoneNumber;
            setFieldsValue(resetValue);
        } else if (key === "otherInfo"){
            const CompanyName = `CompanyName${num}`;
            const Email = `Email${num}`;
            const FirstName = `FirstName${num}`;
            const JobTitle = `JobTitle${num}`;
            const LastName = `LastName${num}`;
            const PhoneNumber = `PhoneNumber${num}`;

            resetValue[CompanyName] = "";
            resetValue[Email] = "";
            resetValue[FirstName] = "";
            resetValue[JobTitle] = "";
            resetValue[LastName] = "";
            resetValue[PhoneNumber] = "";
            setFieldsValue(resetValue);
        }
    }

    handleMenu2Click = (item) => {
        const { registerEvent } = this.props;
        const { setFieldsValue } = this.props.form;
        const { currentUserInfo } = registerEvent; 
        const key = item.key;
        if (key === "myInfo" && !!currentUserInfo.Email) {
            setFieldsValue({
                CompanyName: currentUserInfo.CompanyName,
                Email: currentUserInfo.Email,
                FirstName: currentUserInfo.FirstName,
                JobTitle: currentUserInfo.JobTitle,
                LastName: currentUserInfo.LastName,
                PhoneNumber: currentUserInfo.PhoneNumber,
            });
        } else if (key === "otherInfo") {
            setFieldsValue({
                CompanyName: "",
                Email: "",
                FirstName: "",
                JobTitle: "",
                LastName: "",
                PhoneNumber: "",
            });
        }
    }

    renderMenu = (contactList, i) => {
        return(
            // <Menu onClick={(i) => { this.handleMenuClick(i)}}>
            <div>
                {contactList.length?contactList.map((item,index)=>{
                    return (
                        <Menu onClick={this.handleMenu1Click} key={index}>
                            <Menu.Item key={`myInfo${i}`}><a>使用我的账户信息</a></Menu.Item>
                                <Menu.Item key={`${item.Email}${i}`}><a>{`${item.LastName}${item.FirstName}`}</a></Menu.Item>
                            <Menu.Item key={`otherInfo${i}`}><a>其他</a></Menu.Item>
                         </Menu>
                        )
                }) : <Menu onClick={this.handleMenu1Click}>
                        <Menu.Item key={`myInfo${i}`}><a>使用我的账户信息</a></Menu.Item>
                        <Menu.Item key={`otherInfo${i}`}><a>其他</a></Menu.Item>
                    </Menu>}
            </div>
        )
    }

    participantsInfos = (participantsNum, getFieldDecorator, contactList, participantInfo) => {
        var cardList=[];
        if (participantsNum>0){
            for (let i = 1; i <= participantsNum;i++){
                cardList.push(
                    <Card 
                        key={i}
                        title={`参与者信息${i}`} 
                        className={styles.card}
                        extra={<Dropdown overlay={this.renderMenu(contactList, i)}>
                            <a className="ant-dropdown-link">
                                <Icon type="down" />
                            </a>
                        </Dropdown>}
                        >
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="公司">
                                    {getFieldDecorator(`CompanyName${i}`, {
                                        rules: [
                                            { required: true, message: '请填写公司名称!' },
                                        ],
                                        //initialValue: !!participantInfo.CompanyName ? participantInfo.CompanyName:""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="职位">
                                    {getFieldDecorator(`JobTitle${i}`, {
                                        rules: [
                                            { required: true, message: '请填写职位名称!' },
                                        ],
                                        //initialValue: ""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                        </Row>                     
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="姓">
                                    {getFieldDecorator(`LastName${i}`, {
                                        rules: [
                                            { required: true, message: '请填写姓!' },
                                        ],
                                        //initialValue: ""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="名">
                                    {getFieldDecorator(`FirstName${i}`, {
                                        rules: [
                                            { required: true, message: '请填写名!' },
                                        ],
                                        //initialValue: ""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                        </Row>                     
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="电话">
                                    {getFieldDecorator(`PhoneNumber${i}`, {
                                        rules: [
                                            { required: true, message: '请填写电话!' },
                                        ],
                                        //initialValue: ""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem {...formItemLayout1} label="邮箱">
                                    {getFieldDecorator(`Email${i}`, {
                                        rules: [
                                            { required: true, message: '请填写邮箱!' },
                                        ],
                                        //initialValue: ""
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                        </Row>                     
                    </Card>
                ) 
            }
        }
        return cardList;
    }

    participantsNumChange = (value) => {
        const { dispatch, registerEvent} = this.props;
        const { participantsNum } = registerEvent;
        console.log('value',value);
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
    }

    qrCodeLinkClick = (e) => {
        console.log('e',e)
    }

    render() {
        const { registerEvent } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { registerObj, modalVisible , currentEvent, participantsNum, ticketLimit, contactList, participantInfo, currentUserInfo} = registerEvent;
        const eventId = currentEvent.Id;
        console.log('registerObj', registerObj)
        return (
            <div style={{ backgroundColor:"#FBFBFB"}} className={styles.main}>
                <Row>
                    <div>
                        <Modal 
                            width="600"
                            title={
                                <Row>
                                    <Col><h2>恭喜您成功注册！</h2></Col>
                                    <Col>{registerObj.EventName}</Col>
                                </Row>
                                }
                            visible={modalVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            <QRCode size={150} value={!!registerObj.EventId ? registerObj.EventId:"1234"} />
                            <p>
                                <a onClick={(e) => { this.qrCodeLinkClick(e)}}>请在我注册的活动中查看二维码</a>
                            </p>
                            <Row>
                                <Col offset={1}>
                                    <div>
                                        {registerObj.EventTime}
                                        {/* 2018年09月20日
                                        <span>09:30 - 16-30</span> */}
                                    </div>
                                </Col>
                                <Col offset={1}>
                                    <div>
                                        {registerObj.EventLocation}
                                    </div>
                                </Col>
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
                    <Col span={22} offset={1}>
                        <div className={styles.tips}>
                            <Icon type="exclamation-circle-o"/>
                            <span>请填上参与者的具体信息（带*为必填项）如有任何问题</span>
                            <a className={styles.contactUs} href="#">联系我们！</a>
                        </div>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={22} offset={1}>
                            <DePanel title="新房佣金收益" num="1">
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
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <DePanel title="参与者信息" num="2">
                                {
                                    this.participantsInfos(participantsNum, getFieldDecorator, contactList, participantInfo)
                                }
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <DePanel title="选择联系方式" num="3">
                                <Card
                                    title='选择联系方式'
                                    className={styles.card}
                                    extra={<Dropdown overlay={
                                        <Menu onClick={this.handleMenu2Click}>
                                            <Menu.Item key="myInfo">
                                                <a>使用我的账户信息</a>
                                            </Menu.Item>
                                            <Menu.Item key="otherInfo">
                                                <a>其他</a>
                                            </Menu.Item>
                                        </Menu>}>
                                        <a className="ant-dropdown-link">
                                            <Icon type="down" />
                                        </a>
                                    </Dropdown>}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="公司">
                                                {getFieldDecorator('CompanyName', {
                                                    rules: [
                                                        { required: true, message: '请填写公司名称!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="职位">
                                                {getFieldDecorator('JobTitle', {
                                                    rules: [
                                                        { required: true, message: '请填写职位名称!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="姓">
                                                {getFieldDecorator('LastName', {
                                                    rules: [
                                                        { required: true, message: '请填写姓!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="名">
                                                {getFieldDecorator('FirstName', {
                                                    rules: [
                                                        { required: true, message: '请填写名!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="电话">
                                                {getFieldDecorator('PhoneNumber', {
                                                    rules: [
                                                        { required: true, message: '请填写电话!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout1} label="邮箱">
                                                {getFieldDecorator('Email', {
                                                    rules: [
                                                        { required: true, message: '请填写邮箱!' },
                                                    ],
                                                    //initialValue: ""
                                                })(<Input />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>                                
                            </DePanel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem wrapperCol={{ span: 12, offset: 9 }}>
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
                {/* <UserFooter></UserFooter> */}
            </div>
        );
    }
}