import React, { Component } from 'react';
import { Row,Col,Form, Input,Button,Card,Modal,TimePicker,List,Icon,message,Tabs,DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { formatMessage,injectIntl,intlShape,FormattedMessage } from 'react-intl';
import {getPageQuery} from '../../../../../utils/utils';
import styles from './style.less'
const confirm = Modal.confirm;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = "HH:mm:ss"
@Form.create()
@connect(({ eventDuration, loading }) => ({
    eventDuration,
    submitting: loading.effects['eventDuration/getEventDuration'],
}))
@connect(({ eventAgendaList, loading }) => ({
    eventAgendaList,
    submitting: loading.effects['eventAgendaList/getEventAgendaList'],
}))
@connect(({ eventAgendaAddition, loading }) => ({
    eventAgendaAddition,
    submitting: loading.effects['eventAgendaAddition/getEventAgendaAddition'],
}))
@connect(({ eventAgendaDetail, loading }) => ({
    eventAgendaDetail,
    submitting: loading.effects['eventAgendaDetail/getEventAgendaDetail'],
}))
@connect(({ eventAgendaDelete, loading }) => ({
    eventAgendaDelete,
    submitting: loading.effects['eventAgendaDelete/getEventAgendaDelete'],
}))
@connect(({ eventAgendaDates, loading }) => ({
    eventAgendaDates,
    submitting: loading.effects['eventAgendaDates/getEventAgendaDates'],
}))
@connect(({ eventAgendaDateDelete, loading }) => ({
    eventAgendaDateDelete,
    submitting: loading.effects['eventAgendaDateDelete/getEventAgendaDateDelete'],
}))
@connect(({ eventAgendaDateUnique, loading }) => ({
    eventAgendaDateUnique,
    submitting: loading.effects['eventAgendaDateUnique/getEventAgendaDateUnique'],
}))
@connect(({ eventAgendaEdit, loading }) => ({
    eventAgendaEdit,
    submitting: loading.effects['eventAgendaEdit/getEventAgendaEdit'],
}))
class Step3 extends Component{
    constructor(props){
        super(props);
        this.newTabIndex  = 0;
        this.panes = [];
        this.state={
            session:false,
            break: false,
            hideNewModal:false,
            loading: false,
            index:0,
            Type:'',
            eventId:getPageQuery(location.search).id,
            activeKey: "1",
            pane:[],
            dataString:'',
            addPane:false,
            EventAgendeId:""
        }
    }
    addPane = () => {
        this.setState({
            addPane: true,
        });
      }
    
      addPaneOk = (e) => {
        console.log(this.state.pane)
        if(this.state.dataString == ''){
            return
        }
        console.log(this.state.pane)
        this.props.dispatch({
            type: 'eventAgendaDateUnique/getEventAgendaDateUnique',
            payload:{
                EventId:getPageQuery(location.search).id,
                AgendaDate:this.state.dataString
            }
        })
        .then(()=>{
            const {eventAgendaDateUnique:{eventAgendaDateUnique}} = this.props;
            if(eventAgendaDateUnique){
                this.setState({
                    addPane: false,
                })
                this.props.dispatch({
                    type: 'eventAgendaDates/getEventAgendaDates',
                    payload:{
                        EventId:getPageQuery(location.search).id,
                    }
                })
                .then(()=>{
                    const {eventAgendaDates:{eventAgendaDates}} = this.props;
                    if(eventAgendaDates!==null){
                        const mypanes = this.state.pane;
                        this.newTabIndex = eventAgendaDates.length;
                        const activeKey = this.state.dataString;
                        mypanes.push({ title: this.state.dataString, 
                                        content: this.state.dataString,
                                        key: activeKey });
                        this.setState({ pane:mypanes, activeKey },()=>{
                            console.log(this.state.pane)
                        });


                       
                    }
                })
            }
            if(eventAgendaDateUnique == false){
                message.warning("时间已存在~")
            }
        })
      }
    
      addPaneCancel = (e) => {
        this.setState({
            addPane: false,
        });
      }
    
    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    
    onTabClick = (activeKey) => {
        this.setState({ activeKey:this.state.dataString },()=>{
            this.getAgendaList(activeKey);
        });
    }
    changeData = (data,dataString) =>{
        this.setState({
            dataString:dataString
        })
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.pane.forEach((e, i) => {
        if (e.key === targetKey) {
            lastIndex = i - 1;
        }
        });
        const a = this.state.pane.filter(e => e.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = a[lastIndex].key;

        }
        this.setState({ pane:a, activeKey });   
        this.props.dispatch({
            type: 'eventAgendaDateDelete/getEventAgendaDateDelete',
            payload:{
                EventId:getPageQuery(location.search).id,
                AgendaDate:targetKey
            }
        })
        .then(()=>{
            this.props.dispatch({
                type: 'eventAgendaDates/getEventAgendaDates',
                payload:{
                    EventId:getPageQuery(location.search).id,
                }
            })
            .then(()=>{
                const {eventAgendaDates:{eventAgendaDates}} = this.props;
                if(eventAgendaDates.length<1){
                   
                }else{
                    this.panes.splice(0,this.panes.length);
                    
                    {eventAgendaDates.map(item=>(
                        this.panes.push({ title: item, 
                                        content: item, 
                                        key: item })
                    ))}
                    this.setState({ pane:this.panes, activeKey:eventAgendaDates[0] },()=>{
                        this.getAgendaList(eventAgendaDates[0])
                    });
                }
            })
        })
      }
    delAgendaForm =(value)=>{
        const {intl}=this.props;
        const _this = this;
        confirm({
          title: intl.formatMessage({id:'event.content.Do you want to delete this item'}),
          //content: 'Some descriptions',
          onOk (){
            _this.delAgenda(value);
          },
          onCancel() {  
            return;
          },
        });
      }
      delAgenda = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'eventAgendaDelete/getEventAgendaDelete',
            payload:{
                EventId:getPageQuery(location.search).id,
                EventAgendeId:value,
                AgendaIndex:this.state.activeKey
            }
        })
        .then(()=>{
            this.props.dispatch({
                type: 'eventAgendaDates/getEventAgendaDates',
                payload:{
                    EventId:getPageQuery(location.search).id,
                }
            })
        })
        .then(()=>{
            const {eventAgendaDates:{eventAgendaDates}} = this.props;
            if(eventAgendaDates!=[]){
                this.setState({ pane:this.panes, activeKey:this.state.activeKey},()=>{
                    this.getAgendaList(this.state.activeKey)
                });
            }
            if(eventAgendaDates==[]){
                this.setState({
                    pane:[]
                })
            }
        })
    }
    add = () => {
        this.addPane();
    }
    add1 = () => {
        const pane = this.state.pane;
        const activeKey = `newTab${this.newTabIndex++}`;
        pane.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
        this.setState({ pane, activeKey });
      }
    componentDidMount(){
        this.props.dispatch({
            type: 'eventDuration/getEventDuration',
            payload:{
                EventId:getPageQuery(location.search).id,
            }
        })
        .then(()=>{
            this.getAgendaDate();
            this.props.dispatch({
                type: 'eventAgendaList/getEventAgendaList',
                payload:{
                    EventId:getPageQuery(location.search).id,
                    AgendaDate:this.state.activeKey
                }
            })
        })
    }
    getAgendaDate(){
        this.props.dispatch({
            type: 'eventAgendaDates/getEventAgendaDates',
            payload:{
                EventId:getPageQuery(location.search).id,
            }
        })
        .then(()=>{
            const {eventAgendaDates:{eventAgendaDates}} = this.props;
            if(typeof(eventAgendaDates)== String ||typeof(eventAgendaDates)=='undefined' || eventAgendaDates==null || eventAgendaDates== []){

            }else{
                {eventAgendaDates.map(item=>(
                    this.panes.push({ title: item, 
                                    content: item, 
                                    key: item })
                ))}
                this.setState({ pane:this.panes, activeKey:eventAgendaDates[0] },()=>{
                    this.getAgendaList(eventAgendaDates[0])
                });
            }
        })
        
    }
    getAgendaList(activeKey){
        this.props.dispatch({
            type: 'eventAgendaList/getEventAgendaList',
            payload:{
                EventId:getPageQuery(location.search).id,
                AgendaDate:activeKey
            }
        })
    }
      getAgendaForm=(value)=>{
          this.setState({
              session:true
          })
          this.props.dispatch({
            type: 'eventAgendaDetail/getEventAgendaDetail',
            payload:{
                EventAgendaId:value
            }
          })
          .then(()=>{
            const {eventAgendaDetail:{eventAgendaDetail}} = this.props;
            if(typeof(eventAgendaDetail) === 'undefined' || eventAgendaDetail == null){}else{
                console.log(eventAgendaDetail);
                this.props.form.setFieldsValue({
                    EventId:this.state.eventId,
                    EventAgendeId:eventAgendaDetail.EventAgendaId,
                    AgendaId:eventAgendaDetail.AgendaId,
                    AgendaIndex:eventAgendaDetail.AgendaIndex,
                    Title:eventAgendaDetail.Title,
                    StartTime:moment(eventAgendaDetail.StartTime,timeFormat),
                    EndTime:moment(eventAgendaDetail.EndTime,timeFormat),
                    Content:eventAgendaDetail.Content,
                    AgendaDate:eventAgendaDetail.AgendaDate
                })
            }
            this.setState({
                EventAgendeId:eventAgendaDetail.EventAgendaId
            })
        })
      }
    session =() =>{
        console.log(this.state.activeKey);
        this.setState({
            session: true,
            Type:'Session'
        });
    }
    sessionCancel = (e) => {
        this.setState({
            session: false,
        });
      }
      coffee = () => {
        this.setState({
            session: true,
            Type:'Break'
        });
      }
      sessionSubmit = (e) => {
        e.preventDefault();
        if(this.state.EventAgendeId == ""){
            console.log(this.state.EventAgendeId);
            this.props.form.setFieldsValue({
                EventId: this.state.eventId,
                Type:this.state.Type,
                AgendaIndex:this.state.activeKey,
            });
            this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
                if(err){
                    return
                }
                const values = {
                    ...fieldsValue,
                    AgendaDate:this.state.activeKey,
                    StartTime:fieldsValue['StartTime'].format('HH:mm:ss'),
                    EndTime:fieldsValue['EndTime'].format('HH:mm:ss'),
                  }
    
                this.setState({
                    session: false,
                });
                this.props.dispatch({
                    type: 'eventAgendaAddition/getEventAgendaAddition',
                    payload:values
                })
                    .then(()=>{
                        this.props.dispatch({
                            type: 'eventAgendaDates/getEventAgendaDates',
                            payload:{
                                EventId:getPageQuery(location.search).id,
                            }
                        })
                    })
                    .then(()=>{
                        const {eventAgendaDates:{eventAgendaDates}} = this.props;
                            this.setState({ pane:this.panes, activeKey:this.state.activeKey},()=>{
                                this.getAgendaList(this.state.activeKey)
                            });
                    })
            });
        }
        else{
            console.log(this.state.EventAgendeId);
            this.props.form.setFieldsValue({
                EventId: this.state.eventId,
                Type:this.state.Type,
                AgendaIndex:this.state.activeKey,
            });
            this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
                if(err){
                    return
                }
                const values = {
                    ...fieldsValue,
                    AgendaDate:this.state.activeKey,
                    StartTime:fieldsValue['StartTime'].format('HH:mm:ss'),
                    EndTime:fieldsValue['EndTime'].format('HH:mm:ss'),
                  }
    
                this.setState({
                    session: false,
                });
                this.props.dispatch({
                    type: 'eventAgendaEdit/getEventAgendaEdit',
                    payload:values
                })
                    .then(()=>{
                        this.props.dispatch({
                            type: 'eventAgendaDates/getEventAgendaDates',
                            payload:{
                                EventId:getPageQuery(location.search).id,
                            }
                        })
                    })
                    .then(()=>{
                        const {eventAgendaDates:{eventAgendaDates}} = this.props;
                            this.setState({ pane:this.panes, activeKey:this.state.activeKey},()=>{
                                this.getAgendaList(this.state.activeKey)
                            });
                    })
            });
            this.setState({
                EventAgendeId:''
            })
        }
      }
    render(){
        const { form,location } = this.props;
        const { getFieldDecorator } = form;
        const {intl}=this.props;
        const {eventDuration:{eventDuration},eventAgendaList:{eventAgendaList},eventAgendaDates:{eventAgendaDates}} = this.props;
        const disabledDate =(current)=> {
            if(typeof(eventDuration)== String ||typeof(eventDuration)=='undefined' || eventDuration==null || eventDuration== []){}else{
                const dateArray = [];
                
                {eventDuration.map(item=>(
                    dateArray.push({
                        StartDate:item.StartDate,
                        EndDate:item.EndDate
                    })
                ))}
                console.log(dateArray[0].StartDate);
                return current && current < moment().endOf(dateArray[0].StartDate+'') 
                //&& current > moment().startOf(dateArray[0].EndDate);
            }
          }
        if(typeof(eventAgendaList) === 'undefined' || eventAgendaList.length<1||typeof(eventAgendaList)==String){}else{
        }
        {eventAgendaDates!==null || eventAgendaDates.length>1||typeof(eventAgendaDates)!==String}{

        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        const onValidateForm = () => {
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/createEvent/setUp/content/step-form/sponsors',
                    search:location.search
                }) 
            );
          };
        return(
            <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card>
                <Tabs
                    hideAdd
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                    onTabClick={this.onTabClick}
                    tabBarExtraContent={[
                        <Button icon="plus" onClick={this.add}>{intl.formatMessage({id:'event.content.addPane'})}</Button>, 
                        <Button icon="form" onClick={this.session}>{intl.formatMessage({id:'event.content.Session'})}</Button>, 
                        <Button icon="coffee" onClick={this.coffee}>{intl.formatMessage({id:'event.content.Break'})}</Button>]}
                    >
                      
                    {
                        this.state.pane.map(index =>(
                            <TabPane tab={index.content} key={index.key}>
                                <List
                                    style={{width:'70%',margin:'0 auto',border:'1px solid #e8e8e8'}}
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    dataSource={typeof(eventAgendaList)==String?([]):eventAgendaList}
                                    renderItem={item => (
                                    <List.Item actions={[<a><Icon type="edit" theme="outlined" onClick={()=>this.getAgendaForm(item.EventAgendaId)}/></a>, 
                                                        <a><Icon type="close-circle" theme="outlined" onClick={()=>this.delAgendaForm(item.EventAgendaId)}/></a>]}>
                                        <List.Item.Meta
                                            description={item.StartTime+'-'+item.EndTime}
                                            className={styles.desc}
                                        />
                                            <div style={{margin:'0 auto'}}>{item.Title}</div>
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                        )
                    )
                } 
                                    
                </Tabs>
                </Card>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div style={{position:'relative',height:'30px'}}>
                    <Button onClick={onValidateForm} className={styles.saveButton}>
                        {intl.formatMessage({id:'event.content.Save'})}
                    </Button> 
                </div>
            </Col>  
                         <Modal
                        destroyOnClose
                        title="添加活动时间"
                        visible={this.state.addPane}
                        onOk={this.addPaneOk}
                        onCancel={this.addPaneCancel}
                        >
                            <DatePicker 
                            format={dateFormat} 
                            onChange={this.changeData} 
                            style={{width:'100%'}}
                            disabledDate={disabledDate}
                            />
                        </Modal>

                        <Modal
                            destroyOnClose
                            //title={someOneTitle}
                            title={this.state.Type=="Session"?intl.formatMessage({id:'event.content.Session'}):intl.formatMessage({id:'event.content.Break'})}
                            visible={this.state.session}
                            onOk={this.sessionSubmit}
                            onCancel={this.sessionCancel}
                            cancelText={intl.formatMessage({id:'event.content.Cancel'})}
                            okText={intl.formatMessage({id:'event.content.Save'})}
                            >
                                <Form onSubmit={this.sessionSubmit}>
                                    <FormItem
                                        style={{display:'none'}}
                                    >
                                        {getFieldDecorator('EventId', {
                                                        
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem style={{display:'none'}}>
                                        {getFieldDecorator('Type', {                    
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem style={{display:'none'}}>
                                        {getFieldDecorator('AgendaIndex', {                    
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem style={{display:'none'}}>
                                        {getFieldDecorator('EventAgendeId', {                    
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem style={{display:'none'}}>
                                        {getFieldDecorator('AgendaDate', {                    
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem
                                    {...formItemLayout}
                                    label={intl.formatMessage({id:'event.content.Title'})}
                                    className="formItemLabel"
                                    >
                                    {getFieldDecorator('Title', {
                                        rules: [{
                                        required: true, message: 'Please input your Title!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                    </FormItem>
                                    <FormItem
                                    {...formItemLayout}
                                    label={intl.formatMessage({id:'event.content.Time'})}
                                    className="formItemLabel"
                                    >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                        {getFieldDecorator('StartTime', {
                                            config
                                        })(
                                            <TimePicker 
                                            minuteStep={10} secondStep={30}
                                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                                            format={timeFormat} 
                                            placeholder={intl.formatMessage({id:'event.content.Start time'})} 
                                            style={{width:'100%'}}/>
                                        )}
                                        </Col>
                                        <Col span={12}>
                                        {getFieldDecorator('EndTime', config)(
                                            <TimePicker 
                                            minuteStep={10} secondStep={30}
                                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                                            format={timeFormat}  
                                            placeholder={intl.formatMessage({id:'event.content.End time'})} 
                                            style={{width:'100%'}}/>
                                        )}
                                        </Col>
                                    </Row>
                                    </FormItem>
                                    <FormItem
                                    {...formItemLayout}
                                    label={intl.formatMessage({id:'event.content.Details'})}
                                    className="formItemLabel"
                                    >
                                    {getFieldDecorator('Content', {
                                        rules: [{
                                        //required: true, message: 'Please input your Detail!',
                                        }],
                                    })(
                                        <TextArea rows={4} />
                                    )}
                                    </FormItem>
                                </Form>        
                            </Modal>
        </Row>                    
        )
    }
}

export default connect(({ form, loading }) => ({
    //submitting: loading.effects['form/submitStepForm'],
    //data: form.step,
  }))(injectIntl(Step3));