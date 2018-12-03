import React, { Component } from 'react';
import {Tabs, Row, Col ,Input,DatePicker,Icon,TimePicker,Select,Form,Modal} from 'antd';
import img from '../../../assets/org.png'
import AddContacts from '../addContacts'
import moment from 'moment'
import styles from './index.less'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class AddOpportunity extends Component{
  callback(key) {
    console.log(key);
  }
  TimeOnChange(time, timeString) {
    console.log(time, timeString);
  }
  DatePickerOnChange(date, dateString) {
    console.log(date, dateString);
  }
  
  state = { Opportunityvisible: false }

  showOpportunityModal = () => {
    this.setState({
      Opportunityvisible: true,
    });
  }

  handleOpportunityOk = (e) => {
    console.log(e);
    this.setState({
      Opportunityvisible: false,
    });
  }

  handleOpportunityCancel = (e) => {
    console.log(e);
    this.setState({
      Opportunityvisible: false,
    });
  }

  render() {
    return (
      <span>
        <Button type="primary" onClick={this.showModal} style={{marginLeft:8}}>+ Add Company </Button>
        <Modal
            title="Add Opportunity"
            visible={this.state.Opportunityvisible}
            onOk={this.handleOpportunityOk}
            onCancel={this.handleOpportunityCancel}
            width={700}
            cancelText="Cancel"
            okText="Submit">
                <Form>
                  <Row gutter={24}>
                      <Col span={24}>
                          <FormItem className={styles.ModalAddFormitem} >
                            <Input placeholder="Opportunity Name*" className={styles.companyName} />
                          </FormItem>
                      </Col>
                      <Col span={24}>
                          <FormItem className={styles.ModalAddFormitem} >
                            <Input placeholder="Enter Contact/Company Name*" className={styles.companyName} />
                          </FormItem>
                      </Col>
                      <Col span={12}>
                            <FormItem className={styles.ModalAddFormitem} >
                              <Select  placeholder="Chinese RMB">
                                <Option value="red">Red</Option>
                                <Option value="green">Green</Option>
                                <Option value="blue">Blue</Option>
                              </Select>
                            </FormItem>
                       </Col>
                      <Col span={12}>
                          <FormItem className={styles.ModalAddFormitem} >
                            <Input placeholder="Opportunity Value" className={styles.companyName} />
                          </FormItem>
                      </Col>
                      <Col span={12}>
                            <FormItem className={styles.ModalAddFormitem} >
                              <Select  placeholder="Opportunity Stage">
                                <Option value="red">Red</Option>
                                <Option value="green">Green</Option>
                                <Option value="blue">Blue</Option>
                              </Select>
                            </FormItem>
                      </Col>
                      <Col span={12}>
                            <FormItem className={styles.ModalAddFormitem} >
                            <DatePicker onChange={this.DatePickerOnChange} style={{width:'100%'}} placeholder='Expected Closing Date'/> 
                            </FormItem>
                      </Col>
                      <Col span={12}>
                            <FormItem className={styles.ModalAddFormitem} >
                              <Select  placeholder="Sara Liang">
                                <Option value="red">Belle Zhang</Option>
                                <Option value="green">Esaon Zhang</Option>
                                <Option value="blue">Blue</Option>
                              </Select>
                            </FormItem>
                      </Col>
                      <Col span={12}>
                            <FormItem className={styles.ModalAddFormitem} >
                              <Select  placeholder="Opportunity Source">
                                <Option value="red">Red</Option>
                                <Option value="green">Green</Option>
                                <Option value="blue">Blue</Option>
                              </Select>
                            </FormItem>
                      </Col>
                      <Col span={24}>
                              <FormItem className={styles.ModalAddFormitem} >
                                <TextArea placeholder="Write what you want accomplished and how you want it done here." autosize={{minRows: 4, maxRows: 6}} className={styles.modalTextarea}/>
                              </FormItem>
                      </Col>
                  </Row>
                </Form>
          </Modal>
      </span>
    );
  }
}
export default AddOpportunity;