import React, { Component } from 'react';
import { Row, Col ,Form, Input, DatePicker, TimePicker, Select, Radio ,Button,message} from 'antd';
import { connect } from 'dva';
import {injectIntl} from 'react-intl';
import {getLocale} from '../../utils/utils';
import moment from 'moment';
import styles from './Create.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class Create extends Component{
    constructor(){
        super();
        this.state = {
            listDate:[]
        }
    }
    componentWillMount(){
        const  {dispatch } = this.props;
        dispatch({
            type:'event/AllTeamMember',
        })
    }
    handleSubmit = (e) => {
        const {dispatch}=this.props;
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            // if(getLocale)language
            const values = {
                ...fieldsValue,
                'StartDate': fieldsValue['StartDate'].format('YYYY-MM-DD'),
                'EndDate': fieldsValue['EndDate'].format('YYYY-MM-DD'),
                'StartTime': fieldsValue['StartTime'].format('HH:mm:ss'),
                'EndTime': fieldsValue['EndTime'].format('HH:mm:ss'),
                'TeamMemberList':fieldsValue['TeamMemberList']==undefined?[]:fieldsValue['TeamMemberList']
              };
            dispatch({
                type:'event/EventAddition',
                payload:values,
                callback:(data)=>{
                    if(data.ReturnCode=="1001"){
                        message.success(this.props.intl.formatMessage({id:'event.CE.messageSuccess'})); 
                        !this.JudgmentLan(fieldsValue['language'])?message.success(this.props.intl.formatMessage({id:'event.message.lanTs'})):''
                    }
                }
            })
        });
    }
    handleChange = (value) => {
    }
    JudgmentLan=(value)=>{
        console.log(getLocale())
        value=value=="en"?'en-US':'zh-CN';
        return getLocale()==value
    }
    fromDateSelect = (rule, fromMoment, callback) => {
        const form = this.props.form;
        const toMoment = form.getFieldValue('EndDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
          return callback()
        }
    
        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeFrom'}))
        }
        form.validateFields(['EndDate'],(err, fieldsValue) => {
            if(!err){
                form.setFieldsValue(fieldsValue)
            }
        })
        return callback()
    }

    toDateSelect = (rule, toMoment, callback) => {
        const form = this.props.form;
        const fromMoment = form.getFieldValue('StartDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
            return callback()
        }

        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeTo'}))
        }
        form.validateFields(['StartDate'],(err, fieldsValue) => {
            if(!err){
                form.setFieldsValue(fieldsValue)
            }
        })
        return callback()
    }
    disabledDate=(current)=>{
        return current && current < moment().endOf('day');
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const startDate = moment().subtract(8, 'days');
        const {intl,teamMember}=this.props;
        const MemberList= teamMember!=[]?teamMember.map(province => (province.DisplayName!=null)?<Option key={province.Id} value={province.Id}>{province.FirstName}{province.LastName}</Option>:''):'';
        return(
            <div className={styles.main}>
               <div className={styles.Cheaders}>
                    Event
               </div>
               <Row>
                  <Col span={22} offset={1} style={{marginTop:20}}>
                    <div className={styles.CeventTile}>{intl.formatMessage({id:'event.createEventDes'})}</div>
                    <div className={styles.CEventContent}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <span className={styles.formTitle}>
                                        {intl.formatMessage({id:'event.create'})}
                                    </span>
                                </Col>
                                <Col span={12}>
                                    <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.eventTitle'})}>
                                    {getFieldDecorator('Title', {
                                        rules: [{ required: true, message: intl.formatMessage({id:'event.CE.messageTitle'}) }],
                                    })(
                                        <Input maxLength={200} />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.Language'})}>
                                        {getFieldDecorator('language', {
                                            rules: [{ required: true,message:intl.formatMessage({id:'event.CE.messageLan'})}],
                                        })(
                                        <Select>
                                            <Option value="en">{intl.formatMessage({id:'event.common.english'})}</Option>
                                            <Option value="zh">{intl.formatMessage({id:'event.common.chinese'})}</Option>
                                        </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <Col span={12} style={{paddingRight:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startDate'})}>
                                            {getFieldDecorator('StartDate', {
                                                rules: [
                                                    { type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageSD'})  },
                                                    { validator: this.fromDateSelect},
                                                ],
                                            })(
                                                <DatePicker  placeholder='' disabledDate={this.disabledDate}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}  style={{paddingLeft:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.endDate'})}>
                                            {getFieldDecorator('EndDate', {
                                                rules: [
                                                    { type: 'object', required: true, message: intl.formatMessage({id:'event.CE.messageED'}) },
                                                    { validator: this.toDateSelect},
                                                ],
                                            })(
                                            <DatePicker  placeholder='' disabledDate={this.disabledDate}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingRight:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startTime'})}>
                                            {getFieldDecorator('StartTime', {
                                                rules: [{type: 'object', required: true, message: intl.formatMessage({id:'event.CE.messageST'}) }],
                                            })(
                                                <TimePicker defaultOpenValue={moment('09:00:00', 'HH:mm:ss')} style={{ width: '100%' }} minuteStep={15} secondStep={10}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingLeft:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.endTime'})}>
                                            {getFieldDecorator('EndTime', {
                                                rules: [{type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageET'})  }],
                                            })(
                                                <TimePicker  defaultOpenValue={moment('09:00:00', 'HH:mm:ss')}  style={{ width: '100%' }}  minuteStep={15} secondStep={10}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Col>  
                                <Col span={24}>
                                    <span className={styles.formTitle}>
                                        {intl.formatMessage({id:'event.common.memberTeam'})}
                                    </span>
                                    <FormItem>
                                    {getFieldDecorator('TeamMemberList', {
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{ width: '100%' }}
                                                onChange={this.handleChange}
                                                showSearch={true}>
                                                {MemberList}
                                            </Select>   
                                        )} 
                                    </FormItem> 
                                </Col>
                                <Col span={24} style={{textAlign:'center',marginTop:20}}>
                                    <FormItem>
                                        <Button type="primary" htmlType="submit" className={styles.SaveButton}>Create Event</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>   
                  </Col>  
               </Row>
            </div>
        )
    }
}
export default connect(({event = {}, loading }) => ({
    teamMember:event.teamMember
  }))(injectIntl(Create));