import React, { Component } from 'react';
import { Row,Col,Form, Input, DatePicker,TimePicker, Select,Checkbox,Radio ,Button, Icon} from 'antd';
import styles from './Create.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
        xl:{span:20,offset:2},
        lg:{span:20,offset:2},
        md:{span:20,offset:2},
        sm:{span:24},
        xs:{span:24}
    },
  };
export default class Create extends Component{
    state = {
        value: 1,
      }
    
    selectChange(value,key) {
        console.log(value);
        console.log(key);
    }
    render(){
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        return(
            <div className={styles.main}>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.title} >
                        <Icon type="calendar" style={{ fontSize: 26, color: '#86bc25' }} />
                        <h1>Create a new event</h1>
                        <h4>Please fill in all the event details</h4>
                    </div>
                       
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Form >
                        <FormItem
                        {...formItemLayout}
                        //validateStatus="error"
                        help=""
                        >
                        <Input placeholder="Event Title" />
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        hasFeedback
                        validateStatus="success"
                        >
                        <Select defaultValue="1">
                            <Option value="1">中文</Option>
                            <Option value="2">English</Option>
                            <Option value="3">繁体中文</Option>
                        </Select>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            >
                            <Col span={11}>
                                <FormItem validateStatus="" help="">
                                    <DatePicker placeholder="Start Date"/>
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                <DatePicker placeholder="End Date"/>
                                </FormItem>
                            </Col>
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            >
                            <Col span={11}>
                                <FormItem validateStatus="" help="">
                                    <TimePicker style={{ width: '100%' }} placeholder="Start Time"/>
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                    <TimePicker style={{ width: '100%' }} placeholder="End Time"/>
                                </FormItem>
                            </Col>
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        hasFeedback
                        validateStatus=""
                        >
                        <Select
                            defaultValue="Select a member or team to add to your event team"

                            onChange={this.selectChange}
                        >
                            <OptGroup label="Teams">
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                            </OptGroup>
                            <OptGroup label="Members">
                                <Option value="Yiminghe">yiminghe</Option>
                            </OptGroup>
                        </Select>
                        </FormItem>



                        <FormItem
                        {...formItemLayout}
                        hasFeedback
                        validateStatus=""
                        >
                        <Checkbox
                         //onChange={onChange}
                         >
                         Activate event community
                         </Checkbox>
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        hasFeedback
                        validateStatus=""
                        >
                        <RadioGroup 
                        //onChange={this.onChange} 
                        value={this.state.value}>
                            <Radio style={radioStyle} value={1}>Open when event is published</Radio>
                            <Radio style={radioStyle} value={2}>Open one week before event start</Radio>
                            <Radio style={radioStyle} value={3}>Open when event begins</Radio>
                        </RadioGroup>
                        </FormItem>

                        <FormItem {...formItemLayout}>
                            <Button type="primary" htmlType="submit">Create Event</Button>
                        </FormItem>

                    </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
