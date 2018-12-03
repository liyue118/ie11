import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux} from 'dva/router';
import { Col ,Row,Form,Input, Button} from 'antd';
import md5 from 'blueimp-md5';
import logo from '../../assets/de.png';
import styles from './Register.less';
const FormItem = Form.Item;
const Search = Input.Search;
@Form.create()
class ForgotPass extends Component {
  constructor(){
    super()
    this.state = {
        height:window.innerHeight,
      }
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.main} style={{width: '100%', height: this.state.height}}>
      <div className={styles.formMain}>
        <img src={logo} style={{display:'block',margin:'0 auto'}}></img>
        <a style={{cursor:'default',display:'inline-block',marginTop:5}}>Please enter the registered mailbox and we will send the verification code to that mailbox.</a>
          <Form style={{width:375,margin:'0 auto'}}>
                <FormItem>
                  {getFieldDecorator('Email', {
                    rules: [{ required: true, message: 'Please input your Email!' }],
                  })(
                    <Search
                    placeholder="Please input your Email"
                    onSearch={value => console.log(value)}
                    enterButton="Send"
                    />
                  )}
                </FormItem>
                <a>Click the login email to get the verification code</a>
                <FormItem>
                  {getFieldDecorator('virific', {
                    rules: [{ required: true, message: 'Please input your verification code!' }],
                  })(
                    <Input type="number" placeholder="Verification code" />
                  )}
                </FormItem>
                <FormItem className={styles.firstname}>
                  {getFieldDecorator('newpasss', {
                    rules: [{ required: true, message: 'Please input your New Password!' }],
                  })(
                    <Input type="password" placeholder="New Password" />
                  )}
                </FormItem>
                <FormItem className={styles.lastname}>
                  {getFieldDecorator('recep', {
                    rules: [{ required: true, message: 'Please input your Repetition Password!' }],
                  })(
                    <Input  type="password" placeholder="Repetition Password" />
                  )}
                </FormItem>
                <Button type="primary" htmlType="submit" >
                    Save the change
                </Button>
              </Form>
          </div>
      </div>
    );
  }
}

export default connect()(ForgotPass);