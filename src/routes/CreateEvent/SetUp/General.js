import React, { Component } from 'react';
import { Row, Col, Form, Input, DatePicker, TimePicker, Select, Checkbox ,Button, Cascader,message } from 'antd';
import { connect } from 'dva';
import {injectIntl} from 'react-intl';
import {getPageQuery} from '../../../utils/utils';
import moment from 'moment';
import styles from  './General.less'

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class General extends Component{
    constructor(props){
        super(props);
        this.state={
            isChecked:false,
            eventid:getPageQuery(props.location.search).id
        }
    }

    componentWillMount(){
        const {dispatch } = this.props;
        dispatch({
            type:'event/GeneralEventDetails',
            payload:{'EventId':this.state.eventid}
        })
    }

    componentWillReceiveProps(nextProps){
        const {generalInitDate}=nextProps;
        if(generalInitDate.RegisterFrom!=null){
            this.setState({
                isChecked:true
            })
        }
    }

    onChange=(e)=>{
        const {generalInitDate}=this.props;
        if(e.target.checked==false){
            generalInitDate['RegisterFrom']=null;
            generalInitDate['RegisterTo']=null;
        }
        this.setState({
            isChecked:e.target.checked
        })
    }

    handleSubmit = (e) => {
        const {dispatch,generalInitDate}=this.props;
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            for(var p in fieldsValue){
                if(fieldsValue[p]==undefined || fieldsValue[p]== null){
                    delete fieldsValue[p]
                }
            }
            delete fieldsValue['RegisterCheckbox'];
            let Registerlist;
            this.state.isChecked?(
                  Registerlist={
                      "RegisterFrom":fieldsValue['RegisterFrom'].format('YYYY-MM-DD'),
                      "RegisterTo":fieldsValue['RegisterTo'].format('YYYY-MM-DD'),
                  }  
            ):null;
            let industryList;
            if (!!fieldsValue["Industry"] && fieldsValue["Industry"].length === 2){
                industryList={
                    "IndustryId":fieldsValue["Industry"][0],
                    "SectorId":fieldsValue["Industry"][1],
                }  
            } else if (!!fieldsValue["Industry"] && fieldsValue["Industry"].length === 1){
                industryList={
                    "IndustryId":fieldsValue["Industry"][0],
                    "SectorId":"",
                } 
            }
            const values = {
                ...fieldsValue,
                'StartDate': fieldsValue['StartDate'].format('YYYY-MM-DD'),
                'EndDate': fieldsValue['EndDate'].format('YYYY-MM-DD'),
                'StartTime': fieldsValue['StartTime'].format('HH:mm:ss'),
                'EndTime': fieldsValue['EndTime'].format('HH:mm:ss'),
                "EventId":this.state.eventid,
                ...industryList,
                ...Registerlist
              };
            dispatch({
                type:'event/EventBasicEdit',
                payload:values,
                callback:(data)=>{
                    if(data.ReturnCode=='1001'){
                        message.success(this.props.intl.formatMessage({id:'event.SaveSuccess'}));
                    }
                }
            })
        });
    }

    fromDateSelect = (rule, fromMoment, callback) => {
        const form = this.props.form;
        const toMoment =form.getFieldValue('EndDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
          return callback()
        }
    
        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeFrom'}))
        }else{
            // form.setFieldsValue({
            //     EndDate:toMoment
            // })
            // form.resetFields(['EndDate'])
        }
        return callback()
       
    }

    toDateSelect = (rule, toMoment, callback) => {
        const form = this.props.form;
        const fromMoment=form.getFieldValue('StartDate');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
            return callback()
        }

        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeTo'}))
        }else{
            // form.setFieldsValue({
            //     StartDate:fromMoment
            // })
            // form.resetFields(['StartDate'])
        }
        return callback()
    }
    RegfromDateSelect= (rule, fromMoment, callback) => {
        const form = this.props.form;
        const toMoment =form.getFieldValue('RegisterTo');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
          return callback()
        }
    
        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeFrom'}))
        }
        form.validateFields(['RegisterTo'],(err, fieldsValue) => {
            form.setFieldsValue(fieldsValue);
        })

        return callback()
       
    }
    RegtoSelect= (rule, toMoment,callback) => {
        const form = this.props.form;
        const fromMoment=form.getFieldValue('RegisterFrom');
        // 结束如期必须必起始日期大
        if (!toMoment || !fromMoment) {
            return callback()
        }

        if (toMoment.isBefore(fromMoment, 'day')) {
            return callback(this.props.intl.formatMessage({id:'event.g.timeTo'}))
        }
        form.validateFields(['RegisterFrom'],(err, fieldsValue) => {
            form.setFieldsValue(fieldsValue);
        })

        return callback()
    }
    OnlyShowNumber=(value)=>{
        value=value!=''?new RegExp(/^[0-9]*$/).test(value)?value:'':''
        return value;
    }
    disabledDate=(current)=>{
        return current && current < moment().endOf('day');
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {intl,generalInitDate,teamMember,eventType,IndustryList}=this.props;
        const dateFormat = 'YYYY-MM-DD';
        const timeFormat = 'HH:mm:ss';
        const teamMemberList= teamMember!=[]?teamMember.map(province => (province.DisplayName!=null)?<Option key={province} value={province.Id}>{province.FirstName}{province.LastName}</Option>:''):'';
        const eventTypeList=eventType!=[]?eventType.map(event => <Option key={event} value={event.Key}>{event.Value}</Option>):'';
        return(
            <div className={styles.main}>
                <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        {intl.formatMessage({id:'event.menu.General Settings'})}
                    </div>
                </div>
                <Row>
                    <Col span={22} offset={1} style={{marginTop:20}}>
                        <div className={styles.CeventTile} style={{textAlign:'left'}}>{intl.formatMessage({id:'event.general.setting'})}</div>
                        <div className={styles.CEventContent}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <FormItem label={intl.formatMessage({id:'event.general.title'})} className={styles.fromItem}>
                                            {getFieldDecorator('Title', {
                                                initialValue:generalInitDate.Title!=null?generalInitDate.Title:null,
                                                rules: [{ required: true, message: intl.formatMessage({id:'event.CE.messageTitle'})}],
                                            })(  
                                                <Input />
                                            )}
                                        </FormItem>
                                        <FormItem label={intl.formatMessage({id:'event.general.subtitle'})} className={styles.fromItem}>
                                            {getFieldDecorator('SubTitle', {
                                                initialValue:generalInitDate.SubTitle!=null?generalInitDate.SubTitle:null,
                                                rules: [{ required: true, message:intl.formatMessage({id:'event.g.messageSubT'})}],
                                            })(  
                                                <Input />
                                            )} 
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.general.industry'})}>
                                            {getFieldDecorator('Industry', {
                                                initialValue: !!generalInitDate.IndustryId && !!generalInitDate.SectorId ? [generalInitDate.IndustryId, generalInitDate.SectorId]:[],
                                                rules: [{ required: true, message: intl.formatMessage({id:'event.g.messageInd'})}],
                                            })(
                                                < Cascader options={IndustryList} placeholder="" changeOnSelect />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingRight:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startDate'})} >
                                            {getFieldDecorator('StartDate', {
                                                initialValue:generalInitDate.StartDate!=null?moment(generalInitDate.StartDate,dateFormat):undefined,
                                                rules: [
                                                    { type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageSD'}) },
                                                    { validator: this.fromDateSelect},
                                                ],
                                            })(
                                                <DatePicker placeholder=''  format={dateFormat} disabledDate={this.disabledDate}/>
                                            )}
                                    </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingLeft:12}}>
                                        <FormItem label={intl.formatMessage({id:'event.common.endDate'})} className={styles.fromItem}>
                                            {getFieldDecorator('EndDate', {
                                                initialValue:generalInitDate.EndDate!=null?moment(generalInitDate.EndDate,dateFormat):undefined,
                                                rules: [
                                                    { type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageED'}) },
                                                    { validator: this.toDateSelect},
                                                ],
                                            })(
                                                <DatePicker format={dateFormat} placeholder=''  disabledDate={this.disabledDate}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingRight:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startTime'})}>
                                            {getFieldDecorator('StartTime', {
                                                initialValue:generalInitDate.StartTime!=null?moment(generalInitDate.StartTime,timeFormat):undefined,
                                                rules: [{ type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageST'}) }],
                                            })(
                                                <TimePicker style={{ width: '100%' }} format={timeFormat} placeholder=''  minuteStep={15} secondStep={10}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingLeft:12}}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.endTime'})}>
                                            {getFieldDecorator('EndTime', {
                                                initialValue:generalInitDate.EndTime!=null?moment(generalInitDate.EndTime,timeFormat):undefined,
                                                rules: [{ type: 'object', required: true, message: intl.formatMessage({id:'event.CE.messageET'}) }],
                                            })(
                                                <TimePicker style={{ width: '100%' }} format={timeFormat} placeholder=''  minuteStep={15} secondStep={10}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.general.eventType'})}>
                                            {getFieldDecorator('Type', {
                                                initialValue:generalInitDate.Type!=null?(generalInitDate.Type+''):undefined,
                                            })(
                                            <Select  placeholder='' >
                                                {eventTypeList}
                                            </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.Language'})}>
                                            {getFieldDecorator('Language', {
                                                initialValue:generalInitDate.Language!=null?generalInitDate.Language:undefined,
                                                rules: [{ required: true, message:intl.formatMessage({id:'event.CE.messageLan'})}],
                                            })(
                                                <Select placeholder=''>
                                                    <Option value="en">{intl.formatMessage({id:'event.common.english'})}</Option>
                                                    <Option value="zh">{intl.formatMessage({id:'event.common.chinese'})}</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.general.inContact'})}>
                                            {getFieldDecorator('InternalContactor', {
                                                initialValue:generalInitDate.InternalContactor!=null?generalInitDate.InternalContactor:undefined,
                                            })(
                                                <Select placeholder='' showSearch>
                                                    {teamMemberList}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.general.pubContact'})}>
                                            {getFieldDecorator('ExternalContactor', {
                                                initialValue:generalInitDate.ExternalContactor!=null?generalInitDate.ExternalContactor:undefined,
                                                rules: [{ required: true, message: intl.formatMessage({id:'event.g.messageEC'})}],
                                            })(
                                                <Select placeholder='' showSearch>
                                                    {teamMemberList}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                
                                    <Col span={24}>
                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.general.capacity'})}>
                                            {getFieldDecorator('Capacity', {
                                                initialValue:generalInitDate.Capacity!=null?generalInitDate.Capacity:'',
                                                normalize:this.OnlyShowNumber,
                                                rules: [{ required: true, message:intl.formatMessage({id:'event.ge.capacity'})}],
                                            })(
                                                <Input placeholder=''/>
                                            )}   
                                        </FormItem>
                                    </Col>
                                
                                    <Col span={24}>
                                        <FormItem>
                                            {getFieldDecorator('RegisterCheckbox', {
                                                valuePropName: 'checked',
                                                initialValue:generalInitDate.RegisterFrom!=null?true:false},
                                            )(   
                                            <Checkbox onChange={this.onChange}>
                                                {intl.formatMessage({id:'event.general.setTime'})}
                                            </Checkbox>
                                            )}
                                        </FormItem> 
                                        {this.state.isChecked?(
                                            <Col span={24}>
                                                <FormItem style={{border:'none'}}>
                                                    <Col span={12} style={{paddingRight:12}}>
                                                        <FormItem className={styles.fromItem} label={intl.formatMessage({id:'event.common.startDate'})}>
                                                            {getFieldDecorator('RegisterFrom', {
                                                                initialValue:generalInitDate.RegisterFrom!=null? moment(generalInitDate.RegisterFrom,dateFormat):undefined,
                                                                rules:[
                                                                 { type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageSD'}) },
                                                                 { validator: this.RegfromDateSelect},
                                                                //  { validator: this.RegisterfromDateSelect}]
                                                                ]
                                                            })(
                                                                <DatePicker placeholder="" disabledDate={this.disabledDate}  />
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft:12}}>
                                                        <FormItem  className={styles.fromItem} label={intl.formatMessage({id:'event.common.endDate'})}>
                                                             {getFieldDecorator('RegisterTo', {
                                                                initialValue:generalInitDate.RegisterTo!=null? moment(generalInitDate.RegisterTo,dateFormat):undefined,
                                                                rules:[
                                                                 { type: 'object', required: true, message:intl.formatMessage({id:'event.CE.messageSD'}) },
                                                                 { validator: this.RegtoSelect},
                                                                ]
                                                            })(
                                                                <DatePicker placeholder="" disabledDate={this.disabledDate}  />
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </FormItem>
                                            </Col>
                                        ):null}
                                    </Col>
                                    <Col span={24}>
                                        <FormItem>
                                            {getFieldDecorator('ApprovalRequired', {
                                                valuePropName: 'checked',
                                                initialValue:generalInitDate.ApprovalRequired!=null?generalInitDate.ApprovalRequired:undefined
                                            })(
                                                <Checkbox >
                                                    {intl.formatMessage({id:'event.general.AArequired'})}
                                                </Checkbox>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem>
                                            {getFieldDecorator('DisableRegistration', {
                                                valuePropName: 'checked',
                                                initialValue:generalInitDate.DisableRegistration!=null?generalInitDate.DisableRegistration:undefined
                                            })(
                                                <Checkbox >
                                                    {intl.formatMessage({id:'event.general.disable'})}
                                                </Checkbox>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem>
                                            {getFieldDecorator('IncludeETicket', {
                                                valuePropName: 'checked',
                                                initialValue:generalInitDate.IncludeETicket!=null?generalInitDate.IncludeETicket:undefined
                                            })(
                                                <Checkbox >
                                                    {intl.formatMessage({id:'event.general.confirmationEmail'})}
                                                </Checkbox>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem>
                                            {getFieldDecorator('OneTicketPerRegistant', {
                                                valuePropName: 'checked',
                                                initialValue:generalInitDate.OneTicketPerRegistant!=null?generalInitDate.OneTicketPerRegistant:undefined
                                            })(
                                                <Checkbox >
                                                    {intl.formatMessage({id:'event.general.registrant'})}
                                                </Checkbox>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24} style={{textAlign:'center',marginTop:20}}>
                                        <FormItem>
                                            <Button type="primary" htmlType="submit" className={styles.SaveButton}>{intl.formatMessage({id:'event.common.save'})}</Button>
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
    IndustryList:event.IndustryList,
    generalInitDate:event.generalInitDate,
    eventType:event.eventType,
    teamMember:event.teamMember
  }))(injectIntl(General));

