import React, { Component } from 'react';
import { Row,Col,Form, Input, DatePicker,TimePicker, Select,Checkbox,Radio ,Button, Icon,Card,List,Alert } from 'antd';
import { connect } from 'dva';
import {routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const RangePicker = DatePicker.RangePicker;

@Form.create()
class General extends Component{
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };
    
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
              return;
            }
      
            // Should format date value before submit.
            const rangeValue = fieldsValue['range-picker'];
            const rangeTimeValue = fieldsValue['range-time-picker'];
            const values = {
              ...fieldsValue,
              'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
              'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
              'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
              'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
              'range-time-picker': [
                rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
              ],
              'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
            };
            console.log('Received values of form: ', values);
          });
      }
    

    render(){
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
    
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
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
              offset: 4,
            },
          },
        };
          const rangeConfig = {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
          };
                
        return(
            <div>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div>
                        <Alert message="Your language settings are different than the primary language of this event (中文). " type="warning" showIcon />
                    </div>
                       
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Button type="primary" style={{float:'right',margin:"24px 0"}}>Save</Button>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                       <Card>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                {...formItemLayout}
                                label="Title"
                                >
                                {getFieldDecorator('email', {
                                    rules: [{
                                    type: 'Title', message: 'The input is not valid E-mail!',
                                    }, {
                                    required: true, message: 'Please input your Title!',
                                    }],
                                })(
                                    <Input/>
                                )}
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                label="subTitle"
                                >
                                {getFieldDecorator('subtitle', {
                                    rules: [{
                                    type: 'subTitle', message: 'The input is not valid subtitle',
                                    }, {
                                    required: true, message: 'Please input your subtitle!',
                                    }],
                                })(
                                    <Input  placeholder="Event subtitle.This tagline shows up on the event page"/>
                                )}
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                label="description"
                                >
                                {getFieldDecorator('description', {
                                    rules: [{
                                    type: 'description', message: 'The input is not valid description',
                                    }, {
                                    required: true, message: 'Please input your description!',
                                    }],
                                })(
                                    <Input placeholder="Description for Search Engines Only (max 200 characters)"/>
                                )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="start/end[showTime]"
                                    >
                                    {getFieldDecorator('range-time-picker', rangeConfig)(
                                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"  style={{width:'100%'}}/>
                                    )}
                                    </FormItem>
                                    <Row gutter={24}>
                                <Col span={8} offset={4}>
                                <FormItem
                                //label="Language Options"
                                >
                                {getFieldDecorator('type', {
                                    
                                })(
                                    <Select
                                    placeholder="Select the type of your event"
                                    >
                                    <Option value="b">Briefing</Option>
                                    <Option value="c">Ceremony</Option>
                                    <Option value="d">Ceremony</Option>
                                    </Select>
                                )}
                                </FormItem>
                                </Col>
                                <Col span={12}>
                                <FormItem
                                >
                                <Select
                                    placeholder="Select the role of your organization"
                                    >
                                    <Option value="lead">Lead Organizer</Option>
                                    <Option value="other">Other</Option>
                                    <Option value="partner">Partner</Option>
                                    <Option value="sponsor">Sponsor</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                </Row>      
                                <Row gutter={24}>
                                <Col span={8} offset={4}>
                                <FormItem
                                //label="Language Options"
                                >
                                {getFieldDecorator('Primary Event Language', {
                                    
                                })(
                                    <Select
                                    placeholder="中文"
                                    disabled
                                    >
                                    <Option value="chinese">中文</Option>
                                    </Select>
                                )}
                                </FormItem>
                                </Col>
                                <Col span={12}>
                                <FormItem
                                >
                                <Select
                                    placeholder="Select one or more additional languages"
                                    >
                                    <Option value="chinese">中文</Option>
                                    <Option value="chineseFanti">中文繁体</Option>
                                    <Option value="english">English</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                </Row>           
                                <Row gutter={24}>
                                <FormItem
                                >
                                    <Col span={8} offset={4}>
                                    <Select
                                    placeholder="internal contact"
                                    >
                                    <Option value="1">select an internal contact*</Option>
                                    <Option value="2">Lacey Li</Option>
                                    <Option value="3">Other</Option>
                                    </Select>
                                    <h4>(This is the person internally in charge of the event)</h4>
                                    </Col>
                                    <Col span={12}>
                                    <Select
                                    placeholder="public contact"
                                    >
                                    <Option value="1">select an public contact*</Option>
                                    <Option value="2">Lacey Li</Option>
                                    <Option value="3">Other</Option>
                                    </Select>
                                    <h4>(This is the person in charge of communication to the public)</h4>
                                    </Col>
                                    </FormItem>
                                </Row>  
                                <Row gutter={24}>
                                <FormItem>
                                    <Col span={8} offset={4}>
                                        <Input  placeholder="Max Attendee Capacity(optional)"/>      
                                    </Col>
                                    </FormItem>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={8} offset={4}>
                                        <Select
                                        placeholder="Account Creation Options"
                                        >
                                        <Option value="1">Optional</Option>
                                        <Option value="2">Not visible</Option>
                                        <Option value="3">Mandatory</Option>
                                        </Select> 
                                        <h5>(Control whether a purchaser can create an EventBank account during online registration)</h5> 
                                    </Col>
                                </Row>
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('Attendee approval required', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>Attendee approval required</Checkbox>
                                )}
                                </FormItem>      
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('Include e-ticket in confirmation email', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>Include e-ticket in confirmation email</Checkbox>
                                )}
                                </FormItem>      
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('Require attendee details for each ticket', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>Require attendee details for each ticket.<a> ( Customize the registration form here)</a></Checkbox>
                                )}
                                </FormItem>      
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('One ticket per registrant', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>One ticket per registrant</Checkbox>
                                )}
                                </FormItem>    
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('Set a specific start and end date for registrations', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>Set a specific start and end date for registrations</Checkbox>
                                )}
                                </FormItem>  
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('(Temporarily) disable registration for this event', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>(Temporarily) disable registration for this event</Checkbox>
                                )}
                                </FormItem>    
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('Show this event on the Deloitte', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>Show this event on the Deloitte organization page after being published.
                                    Click the icons to enable the social media you would like your events to be shared on:</Checkbox>
                                )}
                                </FormItem>  
                                <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('weixin', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox><Icon type="wechat" /></Checkbox>
                                )}
                                </FormItem>    
                            </Form>    
                       </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default connect()(General);