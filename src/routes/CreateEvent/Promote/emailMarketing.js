import React, { Component } from 'react';
import {
    Row, Col, Form, Button, Spin, Modal, Input, Icon, Select, Avatar, Dropdown, Menu, Drawer,
    Divider, Table, Tag, Switch, message, Card
} from 'antd';
import { connect } from 'dva';
import { formatMessage, injectIntl, intlShape } from 'react-intl';
import { getPageQuery, Ip, getCookie } from '../../../utils/utils';
import styles from './index.less'
import { returnAtIndex } from 'lodash-decorators/utils';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;
const expandedRowRender = record =>
    <Row gutter={24}>
        <Col span={24}>
            {record.EventInvitationDetailResults.length ?
                record.EventInvitationDetailResults.map(item => (
                    <p style={{ display: 'inline-block', color: '#5baad7', marginLeft: 6 }}>
                        <Avatar size={32} icon="user" />{item.InvitationName}
                    </p>
                ))
                : ('暂无')}
        </Col>
    </Row>;
const data1 = [];
let array = [];
let attendeeList = [];
let attendeeGroupList = [];
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) { return i; }
    }
    return -1;
}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) { this.splice(index, 1); }
}

@connect(({ eventInvitationList, loading }) => ({
    eventInvitationList,
    submitting: loading.effects['eventInvitationList/getEventInvitationList'],
}))
@connect(({ eventDiscountList, loading }) => ({
    eventDiscountList,
    submitting: loading.effects['eventDiscountList/getEventDiscountList'],
}))
@connect(({ contactGroupList, loading }) => ({
    contactGroupList,
    submitting: loading.effects['contactGroupList/getContactGroupList'],
}))
@connect(({ contactAllList, loading }) => ({
    contactAllList,
    submitting: loading.effects['contactAllList/getContactAllList'],
}))
@connect(({ eventInvitationAddition, loading }) => ({
    eventInvitationAddition,
    submitting: loading.effects['eventInvitationAddition/getEventInvitationAddition'],
}))
@connect(({ eventInvitationDelete, loading }) => ({
    eventInvitationDelete,
    submitting: loading.effects['eventInvitationDelete/getEventInvitationDelete'],
}))
@connect(({ eventInvitationDetail, loading }) => ({
    eventInvitationDetail,
    submitting: loading.effects['eventInvitationDetail/getEventInvitationDetail'],
}))
@connect(({ eventInvitationEdit, loading }) => ({
    eventInvitationEdit,
    submitting: loading.effects['eventInvitationDetail/getEventInvitationEdit'],
}))
@connect(({ sendInvitation, loading }) => ({
    sendInvitation,
    submitting: loading.effects['sendInvitation/getSendInvitation'],
}))
@Form.create()
class EmailMarket extends Component {
    constructor() {
        super();
    }
    state = {
        expandedRowRender,
        title: undefined,
        hasData: true,
        confirmLoading: true,
        invation: false,
        iFrameHeight: '0px',
        Drawer: false,
        value: undefined,
        fetching: false,
        contactList: [],
        type: undefined,
        EventId: getPageQuery(location.search).id,
        editType: undefined,
        disabled: false
    }
    delInvation(id) {
        const _this = this;
        confirm({
            title: 'Do you want to delete this item?',
            //content: 'Some descriptions',
            onOk() {
                _this.deleteInvation(id);
            },
            onCancel() {
                return;
            },
        });
    }
    sendInvitation(id) {
        console.log(id);
        this.props.dispatch({
            type: 'sendInvitation/getSendInvitation',
            payload: {
                InvitationId: id
            }
        })
            .then(() => {
                this.setState({
                    invation: false,
                });
            })
            .then(() => {
                this.getEventInvitationList();
                this.getEventDiscountList();
            })
    }
    deleteInvation(id) {
        this.props.dispatch({
            type: 'eventInvitationDelete/getEventInvitationDelete',
            payload: {
                InvitationId: id
            }
        })
            .then(() => {
                this.getEventInvitationList();
            })
    }
    editInvation(id) {
        console.log(id);
        this.props.dispatch({
            type: 'eventInvitationDetail/getEventInvitationDetail',
            payload: {
                Id: id
            }
        })
            .then(() => {
                const { eventInvitationDetail: { eventInvitationDetail } } = this.props;
                if (eventInvitationDetail != null) {
                    if (eventInvitationDetail.InvitationResult.Status != 1001 || eventInvitationDetail.InvitationResult.Status != "1001") {
                        message.warning("已发送的邮件不能编辑~");
                        return;
                    } else {
                        this.setState({
                            invation: true,
                            editType: "edit",
                            disabled: false
                        });
                        array = [];
                        attendeeList = [];
                        attendeeGroupList = [];
                        const list = eventInvitationDetail.EventInvitationDetailResults.map((item, index) => {
                            array.push({ icon: item.InvitationType == "1001" ? "user" : "team", key: item.InviteeId, label: item.InvitationName })
                            if (item.InvitationType == "1001") {
                                attendeeList.push(item.InviteeId)
                            }
                            if (item.InvitationType == "1002") {
                                attendeeGroupList.push(item.InviteeId);
                            }
                        })
                        {
                            eventInvitationDetail != null || eventInvitationDetail.length < 1 ? (
                                this.props.form.setFieldsValue({
                                    Id: eventInvitationDetail.InvitationResult.Id,
                                    SenderEmailAddress: eventInvitationDetail.InvitationResult.SenderEmailAddress,
                                    Status: eventInvitationDetail.InvitationResult.Status,
                                    TicketPriceType: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.TicketPriceType + '' : undefined,
                                    EventDiscountId: eventInvitationDetail.InvitationResult != null ?
                                        eventInvitationDetail.InvitationResult.EventDiscountId == '00000000-0000-0000-0000-000000000000' ? '' :
                                            eventInvitationDetail.InvitationResult.EventDiscountId + '' : undefined,
                                    InvitationSubject: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.InvitationSubject : undefined,
                                    InvitationLanguage: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.Language + '' : undefined,
                                    AttendeeEmails: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.Emails : undefined,
                                    //contactList:''
                                })

                            ) : (
                                    ''
                                )
                        }
                    }
                }
            })
    }
    componentDidMount() {
        this.getEventInvitationList();
        this.getEventDiscountList();
    }
    getContactAllList() {
        const _this = this;
        _this.props.dispatch({
            type: 'contactAllList/getContactAllList',
            payload: {
                QueryClause: this.state.QueryClause
            }
        })
            .then(() => {
                const { contactAllList: { contactAllList } } = this.props;
                if (typeof (contactAllList) !== 'undefined' || contactList !== [] || contactList !== null) {
                    this.setState({
                        contactList: contactAllList
                    })
                }
            })
    }
    getContactGroupList() {
        const _this = this;
        _this.props.dispatch({
            type: 'contactGroupList/getContactGroupList'
        })
            .then(() => {
                const { contactGroupList: { contactGroupList } } = this.props;
                if (contactGroupList !== null || contactGroupList !== []) {
                    this.setState({
                        contactList: contactGroupList
                    })
                }
            })
    }
    getEventInvitationList() {
        this.props.dispatch({
            type: 'eventInvitationList/getEventInvitationList',
            payload: {
                EventId: getPageQuery(location.search).id
            }
        })
    }
    getEventDiscountList() {
        this.props.dispatch({
            type: 'eventDiscountList/getEventDiscountList',
            payload: {
                EventId: getPageQuery(location.search).id
            }
        })
    }
    handleSearch = (value) =>{
        if(this.state.type == undefined){
            return;
        }else{
            console.log(value);
            this.setState({
                QueryClause:value
            })
            if(this.state.type == "AttendeeList"){
                this.getContactAllList()
            }else{
                this.getContactGroupList();
            }
            
        }
    }
    handleChange = (value) => {
        console.log(this.state.type);
        console.log(value);
        if (this.state.type == "AttendeeList") {
            attendeeList.push(value.key);
            array.push({ icon: "user", key: value.key, label: value.label });
        }
        if (this.state.type == "AttendeeGroupList") {
            attendeeGroupList.push(value.key);
            array.push({ icon: "team", key: value.key, label: value.label });
        }
        console.log(array);
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }
    handleAttendChange = (value) => {
        console.log(value);
        if (value == "AttendeeList") {
            this.setState({
                type: value
            })
            this.getContactAllList()
        }
        if (value == "AttendeeGroupList") {
            this.setState({
                type: value
            })
            this.getContactGroupList()
        }
    }
    deleteTag = (e) => {
        attendeeGroupList.remove(e);
        attendeeList.remove(e);
        for (let index = 0; index < array.length; index++) {
            if (array[index].key = e) {
                array.remove(e)
            }
            else {
                return;
            }
        }
    }
    openInvation = () => {
        attendeeGroupList.length = 0;
        attendeeList.length = 0;
        array.length = 0;
        this.setState({
            invation: true,
            editType: "add",
            disabled: false
        });
    }
    preventDefault(e) {
        e.preventDefault();
    }
    onSaveEmail = (e) => {
        e.preventDefault();
        this.props.form.setFieldsValue({
            EventId: getPageQuery(location.search).id,
            AttendeeList: attendeeList,
            attendeeGroupList: attendeeGroupList
        });
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(this.state.editType + 'Received values of form: ', values);
                this.setState({
                    confirmLoading: true,
                    invation: false,
                    Drawer: false
                });
                if (this.state.editType == "add") {
                    this.props.dispatch({
                        type: 'eventInvitationAddition/getEventInvitationAddition',
                        payload: values
                    })
                        .then(() => {
                            this.getEventInvitationList();
                        });
                }
                if (this.state.editType == "edit") {
                    this.props.dispatch({
                        type: 'eventInvitationEdit/getEventInvitationEdit',
                        payload: values
                    })
                        .then(() => {
                            this.getEventInvitationList();
                        });
                }
            }
        });
    }
    invationlOk(id) {
        console.log(id);
        this.props.dispatch({
            type: 'eventInvitationDetail/getEventInvitationDetail',
            payload: {
                Id: id
            }
        })
            .then(() => {
                const { eventInvitationDetail: { eventInvitationDetail } } = this.props;
                if (eventInvitationDetail != null || eventInvitationDetail.length < 1) {
                    this.setState({
                        invation: true,
                        editType: "edit",
                        disabled: true
                    });
                    array = [];
                    attendeeList = [];
                    attendeeGroupList = [];
                    const list = eventInvitationDetail.EventInvitationDetailResults.map((item, index) => {
                        array.push({ icon: item.InvitationType == "1001" ? "user" : "team", key: item.InviteeId, label: item.InvitationName })
                        if (item.InvitationType == "1001") {
                            attendeeList.push(item.InviteeId)
                        }
                        if (item.InvitationType == "1002") {
                            attendeeGroupList.push(item.InviteeId);
                        }
                    })
                    {
                        eventInvitationDetail != null || eventInvitationDetail.length < 1 ? (
                            this.props.form.setFieldsValue({
                                Id: eventInvitationDetail.InvitationResult.Id,
                                SenderEmailAddress: eventInvitationDetail.InvitationResult.SenderEmailAddress,
                                Status: eventInvitationDetail.InvitationResult.Status,
                                TicketPriceType: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.TicketPriceType + '' : undefined,
                                EventDiscountId: eventInvitationDetail.InvitationResult != null ?
                                    eventInvitationDetail.InvitationResult.EventDiscountId == '00000000-0000-0000-0000-000000000000' ? '' :
                                        eventInvitationDetail.InvitationResult.EventDiscountId + '' : undefined,
                                InvitationSubject: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.InvitationSubject : undefined,
                                InvitationLanguage: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.Language + '' : undefined,
                                AttendeeEmails: eventInvitationDetail.InvitationResult != null ? eventInvitationDetail.InvitationResult.Emails : undefined,
                                //contactList:''
                            })

                        ) : (
                                ''
                            )
                    }

                }
            })
    }
    invationCancel = (e) => {
        this.setState({
            invation: false,
            contactList:[]
        });
    }
    render() {
        const state = this.state;
        const { form } = this.props;
        const { intl } = this.props;
        const { getFieldDecorator } = form;
        const { fetching, data, contactList } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const menu = (Id) => (
            <Menu>
                <Menu.Item>
                    <a onClick={() => this.sendInvitation(Id)}>{intl.formatMessage({ id: 'event.content.Sent' })}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={() => this.invationlOk(Id)}>{intl.formatMessage({ id: 'event.content.View' })}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={() => this.delInvation(Id)}>{intl.formatMessage({ id: 'event.content.Delete' })}</a>
                </Menu.Item>
            </Menu>
        )
        const columns = [{
            title: intl.formatMessage({ id: 'event.content.Internal campaign name' }),
            dataIndex: 'InvitationSubject',
        }, {
            title: intl.formatMessage({ id: 'event.content.Recipients' }),
            dataIndex: 'Emails',
        }, {
            title: intl.formatMessage({ id: 'event.content.Status' }),
            key: 'Status',
            dataIndex: 'Status',
            render: Status => (
                <span>
                    {Status == "1001" ? <Tag color="red">未发送</Tag> : (<Tag color="blue">已发送</Tag>)}
                </span>
            ),
        }, {
            title: intl.formatMessage({ id: 'event.content.Action' }),
            dataIndex: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.editInvation(record.Id)}>{intl.formatMessage({ id: 'event.content.Edit' })}</a>
                    <Divider type="vertical" />
                    <Dropdown overlay={menu(record.Id)}>
                        <a className="ant-dropdown-link">
                            More<Icon type="down" />
                        </a>
                    </Dropdown>
                </span>
            ),
        }];

        const { eventDiscountList: { eventDiscountList }, eventInvitationList: { eventInvitationList } } = this.props;
        const discount = typeof (eventDiscountList) == String ? '' : (
            eventDiscountList == [] || eventDiscountList == null ? '' :
                eventDiscountList.map(item => (
                    <Option value={item.Id}>{item.DiscountName}</Option>
                )
                )
        )
        const emailList = eventInvitationList != [] || eventInvitationList != null ? eventInvitationList : ('');
        let { eventInvitationDetail: { eventInvitationDetail } } = this.props;
        return (
            <div>
                <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        {intl.formatMessage({ id: 'event.content.Campaign' })}
                    </div>
                </div>
                <Row gutter={24}>
                    <Col span={24} style={{ margin: 12 }}>
                        <Button icon="plus-circle" type="primary" onClick={this.openInvation}>{intl.formatMessage({ id: 'event.content.Add campaign' })}</Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col style={{ display: 'none' }}>
                        <Form>
                            <FormItem label="Expandable">
                                <Switch checked={!!state.expandedRowRender} />
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Table {...this.state} columns={columns} dataSource={emailList} />
                    </Col>
                </Row>
                <Modal
                    destroyOnClose
                    title={intl.formatMessage({ id: 'event.content.Campaign Settings' })}
                    visible={this.state.invation}
                    footer={[
                        <Button onClick={this.invationCancel}>{intl.formatMessage({ id: 'event.content.Cancel' })}</Button>,
                        <Button onClick={this.onSaveEmail}>{intl.formatMessage({ id: 'event.content.Save' })}</Button>,
                        this.state.editType == "edit" ? (
                            <Button type="Primary" onClick={() => this.sendInvitation(this.props.form.getFieldValue('Id'))}>{intl.formatMessage({ id: 'event.content.Sent' })}</Button>
                        ) : ('')

                    ]}
                    onCancel={this.invationCancel}
                >
                    <Form onSubmit={this.invationSubmit}>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('Id', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('EventId', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('Status', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('Status', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('SenderEmailAddress', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('AttendeeList', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('attendeeGroupList', {

                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Ticket type' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('TicketPriceType', {
                                rules: [{
                                    //required: true, message: 'Please input your Ticket!',
                                }],
                            })(
                                <Select
                                    disabled={this.state.disabled}
                                >
                                    <Option value="1007001">{intl.formatMessage({ id: 'event.content.Free price' })}</Option>
                                    <Option value="1007003">{intl.formatMessage({ id: 'event.content.Standard price' })}</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Discount Type' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('EventDiscountId', {
                                rules: [{
                                    //required: true, message: 'Please input your EventDiscount!',
                                }],
                            })(
                                <Select
                                    disabled={this.state.disabled}
                                //onChange={this.handleSelectChange}
                                >
                                    {discount}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Campaign' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('InvitationSubject', {
                                rules: [{
                                    //required: true, message: 'Please input your InvitationSubject!',
                                }],
                            })(
                                <Input disabled={this.state.disabled} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Language' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('InvitationLanguage', {
                                rules: [{
                                    //required: true, message: 'Please input your Language!',
                                }],
                            })(
                                <Select
                                    disabled={this.state.disabled}
                                //onChange={this.handleSelectChange}
                                >
                                    <Option value="1001">中文</Option>
                                    <Option value="1002">英文</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Invitation list' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('Attendee', {
                                required: true, message: 'Please input your Attendee!',
                            })(
                                <span>
                                    <Select
                                        placeholder={intl.formatMessage({ id: 'event.content.Invitation list' })}
                                        style={{ width: '32%', marginRight: '3%' }}
                                        onChange={this.handleAttendChange}
                                        disabled={this.state.disabled}
                                    >
                                        <Option value="AttendeeList">个人</Option>
                                        <Option value="AttendeeGroupList">组</Option>
                                    </Select>
                                    <Select
                                        showSearch
                                        labelInValue
                                        placeholder="请先选择邀请类别"
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearch}
                                        onChange={this.handleChange}
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        style={{ width: '65%' }}
                                        disabled={this.state.disabled}
                                    >
                                        {contactList != null || contactList != [] ? (
                                            Array.isArray(contactList) ? (
                                                contactList.map(item => (
                                                    <Option key={item.Key}>{item.Value}</Option>
                                                ))

                                            ) : (
                                                    contactList.Contacts.map(item => (
                                                        <Option key={item.PersonId}>{item.FirstName + item.FirstName}</Option>
                                                    ))
                                                )
                                        ) : ('')}
                                    </Select>
                                </span>
                            )}
                        </FormItem>
                        <Row gutter={24}>
                            {array != [] ? array.map(item => (
                                <Tag
                                    color="blue"
                                    style={{ display: 'inline-block', height: '100%', padding: 2, marginBottom: 6 }}
                                    closable
                                    onClose={this.state.disabled == false ? () => this.deleteTag(item.key) : this.preventDefault}
                                >
                                    <Avatar icon={item.icon} style={{ marginRight: 4, backgroundColor: '#87d068' }} />
                                    {item.label}
                                </Tag>
                            )) : ('')}
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label={intl.formatMessage({ id: 'event.content.Invitation list email' })}
                            className="changeLable"
                        >
                            {getFieldDecorator('AttendeeEmails', {
                                rules: [{
                                    //required: true, message: 'Please input your Attendees!',
                                }],
                            })(
                                <TextArea rows={4} placeholder="请用分号间隔不同邮箱" disabled={this.state.disabled} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}



export default connect()(injectIntl(EmailMarket));