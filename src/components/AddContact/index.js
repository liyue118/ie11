import React, { PureComponent } from 'react'
import { Icon, Modal, Form, Row, Col, Cascader,Select,Input,Button} from 'antd'
import { formatMessage, injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './index.less'
const FormItem = Form.Item;
const Option = Select.Option;

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

const options = [{
    value: '中国',
    label: '中国',
    children: [{
        value: '重庆',
        label: '重庆',
        children: [{
            value: '重庆市',
            label: '重庆市',
            children: [{
                value: '大渡口区',
                label: '大渡口区',
            }],
        }],
    }],
}, {
    value: '日本',
    label: '日本',
    children: [{
        value: '东京',
        label: '东京',
        children: [{
            value: '山口县',
            label: '山口县',
            children: [{
                value: '美东',
                label: '美东',
            }],
        }],
    }],
}];

@Form.create()

export default class AddContact extends PureComponent {
    
    handleSubmit1 = (e) => {
        e.preventDefault();
        const {handleAddUser}=this.props;
        const valObj={};
        this.props.form.validateFields(["LastName1",
            'FirstName1',
            'hangye1',
            'CompanyName1',
            'JobTitle1',
            'Address1',
            'PhoneNumber1',
            'CompanyPhone1',
            "DetailAddress1",
            'Email1',
            ],(err, values) => {
                valObj['FirstName'] = values.FirstName1
                valObj['LastName'] = values.LastName1
                valObj['JobTitle'] = values.JobTitle1
                valObj['PhoneNumber'] = values.PhoneNumber1
                valObj['Email'] = values.Email1
                valObj['CompanyName'] = values.CompanyName1
                valObj['AddressCountry'] = '中国'
                valObj['AddressProvince'] = values.Address1[0]
                valObj['AddressCity'] = values.Address1[1]
                valObj['AddressDistrict'] = values.Address1[2]
                valObj['Street'] = values.DetailAddress1
                valObj['Industry'] = values.hangye1[0]
                valObj['CompanyPhone'] = values.CompanyPhone1
                if (values.hangye1.length === 2) {
                    valObj['Sector'] = values.hangye1[1];
                } else if (values.hangye.length === 1) {
                    valObj['Sector'] = '';
                }
                handleAddUser(valObj)
            });
    }
    render() {
        const {
            visible,
            handleCancel,
            industryOptions,
            addressOption,
            intl
        } = this.props;
        // const { intl } = this.props;
        const { getFieldDecorator, resetFields}=this.props.form;
        return (
            <div>
                <Modal
                    title={intl.formatMessage({ id: 'event.home.addContact' })}
                    width="1200px"
                    visible={visible}
                    onCancel={() => { handleCancel(this.props.form)}}
                    footer={null}>
                    <Form onSubmit={this.handleSubmit1}>
                    {/* <Form onSubmit={handleAddUser}> */}
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.fname' })}>
                                    {getFieldDecorator('FirstName1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.firstname" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.lname' })}>
                                    {getFieldDecorator('LastName1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.lastname" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.general.industry' })}>
                                    {getFieldDecorator('hangye1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.g.messageInd" /> },
                                        ],
                                        //initialValue: !!industryValue && industryValue.length ? industryValue[0].key : ""
                                    })(
                                        <Cascader
                                            options={industryOptions}
                                            placeholder=""
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
                                    {getFieldDecorator('CompanyName1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.companyName" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.position' })}>
                                    {getFieldDecorator('JobTitle1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.position" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.companyAddress' })}>
                                    {getFieldDecorator('Address1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.content.Company Address" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Cascader 
                                            placeholder=""
                                            options={addressOption}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        {/* </Row>

                        <Row> */}
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Detail Company Address' })}>
                                    {getFieldDecorator('DetailAddress1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.content.Detail Company Address" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.phone' })}>
                                    {getFieldDecorator('PhoneNumber1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.phone" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.email' })}>
                                    {getFieldDecorator('Email1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.email" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        {/* </Row>
                        <Row> */}
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.reg.companyPhone' })}>
                                    {getFieldDecorator('CompanyPhone1', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.message.companyPhone" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem {...tailFormItemLayout}>
                            <Button onClick={() => { handleCancel(this.props.form)}} style={{marginRight:'15px'}}>
                                {intl.formatMessage({ id: 'event.Cancel' })}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {intl.formatMessage({ id: 'event.content.Save' })}
                            </Button>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

