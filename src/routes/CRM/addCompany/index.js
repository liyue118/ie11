import React, { Component } from 'react';
import { Modal, Button, Form , Icon, Input, Checkbox, Col,Row,Select } from 'antd';
import PropTypes from 'prop-types'
import styles from  './index.less';
const FormItem=Form.Item;
const Option = Select.Option;
const { TextArea } = Input;


class Addcompany extends Component{
  static propTypes = {
    isShow:PropTypes.bool
  };
  static defaultProps = {
    isShow:false
  };
  constructor(props) {
    super(props); console.log(props);
  }
  
  state = { visible: this.props.isShow }

  showModal = () => {
    console.log("show");
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleSelectChange = (value) =>{
     console.log(value)
  }

  render() {
    return (
      <span>
        <Button type="primary" onClick={this.showModal} style={{marginLeft:8}}>+ 新增公司 </Button>
        <Modal 
        title="添加公司"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={840}
        cancelText="取消"
        okText="确认">
         <Form>
          <Row gutter={24}>
            <Col span={16} className={styles.modalAddTitle}>公司信息</Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="公司名称" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="所属行业" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="电话" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="传真" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="电子邮箱" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="公司网站" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="公司地址" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="邮编" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={16} className={styles.modalAddTitle}>自定义信息</Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="公司全称" >
                <Input  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.fromItem}  label="增值税发票6位开票码" >
                <Input  />
              </FormItem>
            </Col>
            </Row>
         </Form>
        </Modal>
        </span>
    );
  }
}
export default Addcompany;