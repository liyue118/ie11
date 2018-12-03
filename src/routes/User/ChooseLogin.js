import React, { Component } from 'react';
import { connect } from 'dva';
import { Link,routerRedux} from 'dva/router';
import { Col ,Row,Form,Input, Button,Select} from 'antd';
import md5 from 'blueimp-md5';
import logo from '../../assets/de.png';
import styles from './Login.less';
const FormItem = Form.Item;
const InputGroup = Input.Group;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class chooseLogin extends Component {
  constructor(){
    super()
    this.state = {
        height:window.innerHeight
    }
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
        console.log('Received values of form: ', formData);
        dispatch({
          type: 'login/login',
          payload: {
            ...formData,
          },
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.main} style={{width: '100%', height: this.state.height}}>
      <div className={styles.formMain}>
              <img src={logo} style={{display:'block',margin:'0 auto'}}></img>
              <Form onSubmit={this.handleSubmit} className={styles.loginform}>
                <FormItem className={styles.items}>
                  {getFieldDecorator('loginName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input type="number" placeholder="UserName" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" style={{marginTop:22,height:42,backgroundColor: '#5baad7',borderColor: '#5baad7'}}>
                    Log In
                  </Button>
                </FormItem>
              </Form>
        </div>
      </div>
    );
  }
}

export default connect()(chooseLogin);