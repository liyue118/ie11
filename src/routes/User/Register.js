import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux} from 'dva/router';
import { Col ,Row,Form,Input,Select, Button,Popover, Progress} from 'antd';
import md5 from 'blueimp-md5';
import logo from '../../assets/de.png';
import styles from './Register.less';
const FormItem = Form.Item;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/register'],
}))
@connect(({ personLoginAuthCodeResult, loading }) => ({
  personLoginAuthCodeResult,
  submitting: loading.effects['personLoginAuthCodeResult/getPersonLoginAuthCodeResult'],
}))
@Form.create()
class Register extends Component {
  constructor(){
    super()
    this.state = {
        height:window.innerHeight,
        count: 0,
        confirmDirty: false,
        visible: false,
        help: '',
        prefix: '86'
      }
  }
  
  componentWillReceiveProps(nextProps) {
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('Email');
    if (nextProps.register.status === 'ok') {
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/user/register-result',
      //     state: {
      //       account,
      //     },
      //   })
      // );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form } = this.props;
    const value = form.getFieldValue('PhoneNumber');
    if(value && value.length > 10){
      console.log(value);
      let count = 59;
      this.setState({ count });
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
      this.props.dispatch({
        type:'personLoginAuthCodeResult/getPersonLoginAuthCodeResult',
        payload: {
          AuthCodeType:1002,
          PhoneNumber:value
        },
      })
      .then(()=>{
        const {personLoginAuthCodeResult:{personLoginAuthCodeResult}} = this.props;
        console.log(personLoginAuthCodeResult);
        if(personLoginAuthCodeResult.AuthCode == null){
          message.warning(personLoginAuthCodeResult.Info);
          return
        }else{
          this.props.form.setFieldsValue({
            AuthCode:personLoginAuthCodeResult.AuthCode
          })
        }
      })
    }
    return false;
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('Password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields({ force: true },(err, values) => {
      console.log(values);
      const { prefix } = this.state;
      if (!err) {
        const formData = {
          'Email':values.Email,
          'FirstName':values.FirstName,
          'LastName':values.LastName,
          'Password':md5(values.Password),
          'PasswordSecond':md5(values.PasswordSecond),
          'PhoneNumber':values.PhoneNumber,
          'AuthCode':values.AuthCode,
        }
        console.log('Received values of form: ', formData);
        dispatch({
          type: 'register/register',
          payload: {
            ...formData,
            prefix,
          },
        });
      }
    });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('Password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: 'Please input your Password!',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['PasswordSecond'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('Password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main} style={{width: '100%', height: this.state.height}}>
      <div className={styles.formMain}>
        <img src={logo} style={{display:'block',margin:'0 auto'}}></img>
          <Form onSubmit={this.handleSubmit} className={styles.loginform}>
                <FormItem>
                  {getFieldDecorator('Email', {
                    rules: [{ required: true, message: 'Please input your Email!' },
                    {
                      pattern:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                      message: 'Please enter the correct email!',
                    }],
                  })(
                    <Input type="email" placeholder="Email"/>
                  )}
                </FormItem>
                <FormItem className={styles.firstname}>
                  {getFieldDecorator('FirstName', {
                    rules: [{ required: true, message: 'Please input your First Name!' }],
                  })(
                    <Input type="text" placeholder="First Name" />
                  )}
                </FormItem>
                <FormItem className={styles.lastname}>
                  {getFieldDecorator('LastName', {
                    rules: [{ required: true, message: 'Please input your Last Name!' }],
                  })(
                    <Input  type="text" placeholder="Last Name" />
                  )}
                </FormItem>
                <div style={{clear:'both'}}></div>
                <FormItem help={help}>
                  <Popover
                    content={
                      <div style={{ padding: '4px 0' }}>
                        {passwordStatusMap[this.getPasswordStatus()]}
                        {this.renderPasswordProgress()}
                        <div style={{ marginTop: 10 }}>
                          请至少输入 6 个字符。请不要使用容易被猜到的密码。
                        </div>
                      </div>
                    }
                    overlayStyle={{ width: 240 }}
                    placement="right"
                    visible={visible}
                  >
                    {getFieldDecorator('Password', {
                      rules: [
                        {
                          validator: this.checkPassword,
                        },
                      ],
                    })(<Input type="password" placeholder="至少6位密码，区分大小写" />)}
                  </Popover>
                </FormItem>
                <FormItem>
                  {getFieldDecorator('PasswordSecond', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your Password!！',
                      },
                      {
                        validator: this.checkConfirm,
                      },
                    ],
                  })(<Input type="password" placeholder="Confirm password" />)}
                </FormItem>
                <FormItem>
                  <InputGroup compact>
                    <Select
                      value={prefix}
                      onChange={this.changePrefix}
                      style={{ width: '20%'}}
                    >
                      <Option value="86">+86</Option>
                      <Option value="87">+87</Option>
                    </Select>
                    {getFieldDecorator('PhoneNumber', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your phone number!',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: 'Please enter the correct mobile phone number!',
                        },
                      ],
                    })(<Input style={{ width: '80%' }} placeholder="11-digit cell phone number" />)}
                  </InputGroup>
                </FormItem>
                <FormItem>
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator('AuthCode', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your Verification code!',
                          },
                        ],
                      })(<Input placeholder="Verification code" />)}
                    </Col>
                    <Col span={8}>
                      <Button
                        disabled={count}
                        className={styles.getCaptcha}
                        onClick={this.onGetCaptcha}
                      >
                        {count ? `${count} s` : 'Get Code'}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Register
                  </Button>
                </FormItem>
                <div className={styles.other}>
                    <Link to="/user/login">
                    <span  className={styles.clickme}>Log In</span>
                    </Link>
                  </div>  
              </Form>
          </div>
      </div>
    );
  }
}

export default connect()(Register);