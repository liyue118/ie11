import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import antd, { Row, Col, Input, Modal, Dropdown, Menu, Button, Icon, Form,message} from 'antd';
import { formatMessage, injectIntl, intlShape, FormattedMessage } from 'react-intl';
import md5 from 'blueimp-md5';
import styles from './PersonalSetting.less'
import SettingPanel from '../../components/SettingPanel';
import PromptModal from '../../components/PromptModal';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
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
@connect(({ personalSetting, loading }) => ({ //连接modal
    personalSetting,
}))
@Form.create()
class PersonalSetting extends Component {
    state = {
        submitting:false,
    }
    handleSubmit = (e) => {
        this.setState({ submitting: true });
        e.preventDefault();
        const { dispatch, personalSetting} = this.props;
        this.props.form.validateFields((err, values) => {
            values.OldPassword = md5(values.OldPassword);
            values.NewPassword = md5(values.NewPassword);
            values.NewPasswordSecond = md5(values.NewPasswordSecond);
            if (values.OldPassword === values.NewPassword){
                message.warning('不能重置相同的密码！');
                this.setState({ submitting: false });
            } else if (values.NewPassword !== values.NewPasswordSecond){
                message.warning('两次输入的密码不相同！');
                this.setState({ submitting: false });
            }else{
                dispatch({
                    type:"personalSetting/passwordReset",
                    payload: values,
                    callback:(data)=>{
                        if(data==="退出登录"){
                            // dispatch({
                            //     type:'global/logout',
                            //     payload:{}
                            // })
                            this.props.dispatch(routerRedux.push('/user/login'));
                        }
                        this.setState({ submitting: false });
                    }
                })
            }

        });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('NewPassword')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    handlePromptOk = () => {
        const { dispatch, promptObj} =this.props;
        dispatch({
            type: 'personalSetting/closePrompt',
            payload: {
                visible: false,
                onOk: () => { },
            },
        });
    }

    render() {
        const { personalSetting } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { currentUserInfo, promptObj} = personalSetting;
        const {intl} = this.props;
        const { submitting } = this.state;
        return (
            <div>
                <Row>
                    <Col>
                        <PromptModal {...promptObj} onOk={() => { this.handlePromptOk()}} />
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{marginTop:'10px'}}>
                        <SettingPanel icon={<Icon type="lock" theme="outlined" />} title={intl.formatMessage({ id: 'event.content.Password setting' })}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Email address' })}>
                                    {getFieldDecorator('userName', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.content.Please input the email address" /> },
                                        ],
                                        initialValue: !!currentUserInfo && !!currentUserInfo.Email ? currentUserInfo.Email : ""
                                    })(
                                        <Input disabled/>
                                    )}

                                </FormItem>
                                <FormItem {...formItemLayout} label={intl.formatMessage({id:'event.content.Original password'})}>
                                    {getFieldDecorator('OldPassword', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.content.Please input the original password" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input type="password"/>
                                    )}

                                </FormItem>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id:'event.content.New password'})}>
                                    {getFieldDecorator('NewPassword', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.content.Please input a new password" /> },
                                        ],
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input type="password"/>
                                    )}

                                </FormItem>
                                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'event.content.Confirm password' })}>
                                    {getFieldDecorator('NewPasswordSecond', {
                                        rules: [
                                            { required: true, message: <FormattedMessage id="event.content.Please input a confirm password" /> },
                                            { validator: this.compareToFirstPassword }
                                        ],
                                        
                                        //initialValue: currentEvent.Title
                                    })(
                                        <Input type="password"/>
                                    )}

                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                    <Button loading={submitting} type="primary" htmlType="submit">
                                        {intl.formatMessage({ id: 'event.content.Save password' })}
                                    </Button>
                                </FormItem>
                            </Form>
                        </SettingPanel>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2} style={{ marginTop: '10px' }}>
                        
                    </Col>
                </Row>
                
            </div>
        );
    }
}
export default connect()(injectIntl(PersonalSetting));