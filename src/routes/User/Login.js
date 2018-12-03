import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux} from 'dva/router';
import {Form,Input, Button,message,Select,Icon} from 'antd';
import md5 from 'blueimp-md5';
import email from '../../assets/邮件.svg';
import password from '../../assets/密码.svg';
import logo from '../../assets/de.png';
import styles from './Login.less';
const FormItem = Form.Item;
const InputGroup = Input.Group;
@connect(({ personLoginAuthCodeResult, loading }) => ({
  personLoginAuthCodeResult,
  submitting: loading.effects['personLoginAuthCodeResult/getPersonLoginAuthCodeResult'],
}))
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  constructor(){
    super();
    const AuthCode = ''
    this.state = {
        height:window.innerHeight,
        hideVenfication:true,
        loginName:'',
        hashedPassword:'',
        type:'email'
    }
  }
  handleChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
      ],
    });
  }
  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = {
          loginName:values.loginName,
          hashedPassword:md5(values.hashedPassword)
        }
        dispatch({
          type: 'personLoginAuthCodeResult/getPersonLoginAuthCodeResult',
          payload: {
            ...formData,
          },
        })
        .then(()=>{
          const {personLoginAuthCodeResult:{personLoginAuthCodeResult}} = this.props;
          if(personLoginAuthCodeResult.AuthCode == null){
            message.warning(personLoginAuthCodeResult.Info);
            return
          }else{
            this.AuthCode = personLoginAuthCodeResult.AuthCode;
            this.setState({
              hideVenfication:false,
              loginName:values.loginName,
              hashedPassword:md5(values.hashedPassword)
            })
          }
        })
      }
    });
  }

  // codeSummit = (e) =>{
  //   const { dispatch } = this.props;
  //   e.preventDefault();
  //   this.props.form.setFieldsValue({
  //     AuthCode:this.AuthCode,
  //   });
  //   this.props.form.validateFields((err, values) => {
  //     console.log("auth",values)
  //     if (!err) {
  //       const formData = {
  //         loginName:this.state.loginName,
  //         hashedPassword:this.state.hashedPassword,
  //         AuthCode:values.AuthCode
  //       }
  //       console.log('Received values of form: ', formData);
  //       dispatch({
  //         type: 'login/login',
  //         payload: {
  //           ...formData,
  //         },
  //       })
  //       this.setState({
  //         hideVenfication:false
  //       })
  //     }
  //   });
  // }
  codeSummit = (e) =>{
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.prefix == 'email'){
          const formData = {
            loginName:values.loginName,
            hashedPassword:md5(values.hashedPassword)
          }
          console.log('Received values of form: ', formData);
          dispatch({
            type: 'login/login',
            payload: {
              ...formData,
            },
          })
        }
        if(values.prefix == 'phone'){
          const formData = {
            loginName:values.loginName,
            hashedPassword:md5(values.hashedPassword)
          }
          console.log('Received values of form: ', formData);
          dispatch({
            type: 'login/login',
            payload: {
              ...formData,
            },
          })
        }
        
        // dispatch({
        //   type: 'login/login',
        //   payload: {
        //     ...formData,
        //   },
        // })
        // this.setState({
        //   hideVenfication:false
        // })
      }
    });
  }
  handleChange = (value) => {
    console.log(value);
    this.setState({
      type:value
    })
    // this.setState({
    //   dataSource: !value || value.indexOf('@') >= 0 ? [] : [
    //     `${value}@gmail.com`,
    //     `${value}@163.com`,
    //     `${value}@qq.com`,
    //   ],
    // });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting } = this.props;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'email',
    })(
      <Select style={{ width: 90}} onChange={this.handleChange}>
        <Option value="email">Email</Option>
        <Option value="phone">Phone</Option>
      </Select>
    );
    return (
      <div className={styles.main} style={{width: '100%', height: this.state.height}}>
      <div className={styles.formMain}>
              <img src={logo} style={{display:'block',margin:'0 auto'}}></img>
              
              {/* {this.state.hideVenfication?( */}
                {/* <Form onSubmit={this.handleSubmit} className={styles.loginform}> */}
                <Form onSubmit={this.codeSummit} className={styles.loginform}>
                <FormItem className={styles.items}>
                {getFieldDecorator('loginName', {
                  rules: [
                    { required: true, message: 'Please input your email or phone number!' },
                    this.state.type == 'email'?(
                      {
                        pattern:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: 'Please enter the correct email!',
                      }
                    ):(
                    {
                      pattern: /^1\d{10}$/,
                      message: 'Please enter the correct mobile phone number!',
                    })
                  ],
                })(
                  <Input 
                  addonBefore={prefixSelector} 
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  style={{ width: '100%' }}
                  type={this.state.type}
                  />
                )}
              </FormItem>
              <FormItem className={styles.items}>
                {getFieldDecorator('hashedPassword', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input 
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password" 
                  placeholder="Please input your password!" />
                )}
              </FormItem>
              <FormItem>
                <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                style={{marginTop:22,height:42,backgroundColor: '#5baad7',borderColor: '#5baad7'}}>
                  Login
                </Button>
                <div className={styles.other}>
                <Link to="/user/forgotPassword">
                  <span className={styles.forgot}>Forgot password?</span>
                  </Link> 
                  <Link to="/user/register">
                  <span className={styles.clickme}>Register</span>
                  </Link>
                </div>  
              </FormItem>
              </Form>
              {/* ):(
                <Form onSubmit={this.codeSummit} className={styles.loginform}>
                  <p style={{color:'#fff'}}>系统已向您的手机号码131****1868发送了验证码！该验证码5分钟之内有效！如您未收到，可在60S后<a>点击</a>重新接收。</p>
                  <FormItem className={styles.items}>
                  {getFieldDecorator('AuthCode', {
                    rules: [{ required: true, message: 'Please input your code!' }],
                  })(
                    <Input type="text" placeholder="请输入6位数字验证码"/>
                  )}
                </FormItem>
                <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                style={{marginTop:22,height:42,backgroundColor: '#5baad7',borderColor: '#5baad7'}}>
                  Login
                </Button>
                </Form>
              )}*/}
                
              
        </div>
      </div>
    );
  }
}

export default connect()(Login);