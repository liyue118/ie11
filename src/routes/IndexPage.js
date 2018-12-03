import React from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd';

import styles from './IndexPage.less'
import Login from '../components/Login'

class IndexPage extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    }
    render() {
        return (
            <div className={styles.normal}>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className={styles.welcome} />
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col offset={3} xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Login
                                defaultActiveKey={type}
                                onTabChange={this.onTabChange}
                                onSubmit={this.handleSubmit}
                                >
                                <Tab key="account" tab="">
                                    {
                                    login.success === 'false' &&
                                    login.type === 'account' &&
                                    !login.submitting &&
                                    this.renderMessage('账户或密码错误（admin/123456）')
                                    }
                                    <UserName name="User_LoginName" placeholder="admin" />
                                    <Password name="User_LoginPwd" placeholder="123456" />
                                </Tab>
                                <div>
                                    <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
                                    {/* <a style={{ float: 'right' }} href="">忘记密码</a> */}
                                </div>
                                <Submit loading={submitting}>登录</Submit>
                                </Login>
                            </Col>
                        </Row>   
                    </Col>
                </Row>               
            </div>
        )
    }
}


IndexPage.propTypes = {}

export default connect()(IndexPage)
