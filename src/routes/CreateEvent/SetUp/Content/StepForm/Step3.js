import React, { Component } from 'react';
import { Row,Col,Form, Input,Button,Card,Alert,Modal,TimePicker,List,Icon,InputNumber,Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage,injectIntl,intlShape,FormattedMessage } from 'react-intl';
import {getPageQuery} from '../../../../../utils/utils';
import styles from './style.less'
const confirm = Modal.confirm;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const format = 'HH:mm';
const datalist = [
    {
        description:'09:00 -- 09:30',
        content:'会议签到' 
    },{
        description:'09:30 -- 09:45',
        content:'欢迎与开幕致辞' 
    },{
        description:'09:45 -- 10:00',
        content:'中美贸易发展' 
    },{
        description:'10:00 -- 10:45',
        content:'茶歇' 
    }
  ];
@Form.create()
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
class Step3 extends Component{
    constructor(props){
        super(props);
        this.newTabIndex = 0;
        const panes = [
            { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
          ];
        this.state={
            agenda:0,   
            session:false,
            break: false,
            hideNewModal:false,
            loading: false,
            index:0,
            Type:'',
            eventId:getPageQuery(location.search).id,
            activeKey: "1",
            panes,
        }
        this.getAgendaForm = this.getAgendaForm.bind(this);
        this.delAgendaForm = this.delAgendaForm.bind(this);
    }
    
    onChange = (activeKey) => {
        console.log(activeKey)
        this.setState({ activeKey },()=>{
            this.getAgendaList();
        });
        
      }
    onTabClick = (activeKey) => {
        this.setState({ activeKey },()=>{
            this.getAgendaList();
        });
        
    }
      onEdit = (targetKey, action) => {
        this[action](targetKey);
      }
    
      add = () => {
        const panes = this.state.panes;
        const activeKey = `${this.newTabIndex++}`;
        panes.push({ title: 'New Tab',content:{}, key: activeKey });
        this.setState({ panes, activeKey });
      }
    componentDidMount(){
        this.getAgendaDate();
        this.getAgendaList()
    }
    getAgendaDate(){
        this.props.dispatch({
            type: 'eventAgendaDates/getEventAgendaDates',
            payload:{
                EventId:getPageQuery(location.search).id,
            }
        })
        
    }
    getAgendaList(){
        this.props.dispatch({
            type: 'eventAgendaList/getEventAgendaList',
            payload:{
                EventId:getPageQuery(location.search).id,
                AgendaDate:localStorage.getItem('eventAgendaDate')
            }
        })
    }
    session =() =>{
        this.setState({
            session: true,
            Type:'Session'
        });
    }
    sessionCancel = (e) => {
        console.log(e);
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
                AgendaDate:localStorage.getItem("eventAgendaDate"),
                StartTime:fieldsValue['StartTime'].format('HH:mm:ss'),
                EndTime:fieldsValue['EndTime'].format('HH:mm:ss'),
              }
              console.log('Received values of form: ', values);
            this.setState({
                session: false,
            });
            this.props.dispatch({
                type: 'eventAgendaAddition/getEventAgendaAddition',
                payload:values
            },()=>{
                //this.getAgendaList();
            })
        });
      }
      delAgendaForm =(value)=>{
        const _this = this;
        confirm({
          title: 'Do you Want to delete this items?',
          //content: 'Some descriptions',
          onOk (){
            _this.delAgenda(value);
          },
          onCancel() {  
            console.log(value)
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
            //this.getAgendaList();
        });
    }
      getAgendaForm=(value)=>{
          console.log(value);
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
                this.props.form.setFieldsValue({
                    EventId:this.state.eventId,
                    EventAgendeId:eventAgendaDetail.EventAgendeId,
                    AgendaId:eventAgendaDetail.AgendaId,
                    AgendaIndex:eventAgendaDetail.AgendaIndex,
                    //StartTime:eventAgendaDetail.StartTime,
                    //EndTime:eventAgendaDetail.EndTime,
                    Title:eventAgendaDetail.Title,
                    Content:eventAgendaDetail.Content,
                    AgendaDate:eventAgendaDetail.AgendaDate
                })
            }
            
          })
      }
    render(){
        const { form,location } = this.props;
        const { getFieldDecorator } = form;
        const {intl}=this.props;
          const onValidateForm = () => {
            //validateFields((err, values) => {
              //if (!err) {
                this.props.dispatch(
                    routerRedux.push({
                      pathname: '/createEvent/setUp/content/step-form/sponsors',
                      search:location.search
                    }) 
                  );
              //}
            //});
          };
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
            const salesExtra = (
                <div className={styles.salesExtraWrap}>
                  <div className={styles.salesExtra}>
                  <a>
                        <Icon type="plus" style={{paddingRight:3}}/>
                        
                    </a>
                    <a onClick={this.session}>
                        <Icon type="form" style={{paddingRight:3}}/>
                        {intl.formatMessage({id:'event.content.Session'})}
                    </a>
                    <a onClick={this.coffee}>
                        <Icon type="coffee" style={{paddingRight:3}}/>
                        {intl.formatMessage({id:'event.content.Break'})}
                    </a>
                  </div>
                  {/* <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{ width: 256 }}
                  /> */}
                </div>
              );
        const {eventAgendaList:{eventAgendaList},eventAgendaDates:{eventAgendaDates}} = this.props;
        if(typeof(eventAgendaList) === 'undefined' || eventAgendaList.length<1){}else{
            console.log(eventAgendaList)
        }
        if(typeof(eventAgendaDates) === 'undefined'||eventAgendaDates == null || eventAgendaDates.length<1){}else{            
            
        }
        return(
            <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Card id="setPadding">
                    {this.state.agenda !== 0 ? (
                        <span>1</span>
                        ):(
                        <div>
                            <Card bordered={false} bodyStyle={{ padding: 0 }}>
                                <div className={styles.salesCard}>
                                <Tabs
                                    onChange={this.onChange}
                                    activeKey={this.state.activeKey}
                                    type="editable-card"
                                    onEdit={this.onEdit}
                                    onTabClick={this.onTabClick}
                                    tabBarExtraContent={[
                                        <Button icon="plus" onClick={this.add}>add pane</Button>,
                                        <Button icon="form" onClick={this.session}>Session</Button>, 
                                        <Button icon="coffee" onClick={this.coffee}>Break</Button>]}
                                >
                                {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
                                    {/* {eventAgendaDates.map(index =>(
                                    <TabPane tab={index} key={index} closable={true}>
                                        <List
                                            style={{width:'70%',margin:'0 auto',border:'1px solid #e8e8e8'}}
                                            className="demo-loadmore-list"
                                            itemLayout="horizontal"
                                            dataSource={eventAgendaList}
                                            renderItem={item => (
                                            <List.Item actions={[<a><Icon type="edit" theme="outlined" onClick={()=>this.getAgendaForm(item.EventAgendaId)}/></a>, 
                                                                <a><Icon type="close-circle" theme="outlined" onClick={()=>this.delAgendaForm(item.EventAgendaId)}/></a>]}>
                                            <List.Item.Meta
                                                description={item.StartTime+'-'+item.EndTime}
                                                className={styles.desc}
                                            />
                                            <div style={{margin:'0 auto'}}>{item.Content}</div>
                                                        
                                            </List.Item>
                                            )}
                                        />
                                    </TabPane>
                                    ))} */}
                                </Tabs>
                                </div>
                                </Card>


                            <Modal
                            destroyOnClose
                            title={intl.formatMessage({id:'event.content.Create a new session'})}
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
                                    label="起始时间"
                                    className="formItemLabel"
                                    >
                                    <Row gutter={24}>
                                        <Col span={12}>
                                        {getFieldDecorator('StartTime', config)(
                                            <TimePicker placeholder={intl.formatMessage({id:'event.content.Start time'})} style={{width:'100%'}}/>
                                        )}
                                        </Col>
                                        <Col span={12}>
                                        {getFieldDecorator('EndTime', config)(
                                            <TimePicker placeholder={intl.formatMessage({id:'event.content.End time'})} style={{width:'100%'}}/>
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
                                        required: true, message: 'Please input your Detail!',
                                        }],
                                    })(
                                        <Input
                                        style={{height:60}}
                                        />
                                    )}
                                    </FormItem>
                                </Form>        
                            </Modal>
                        </div>
                    )} 
                </Card>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div style={{position:'relative',height:'30px'}}>
                            <Button onClick={onValidateForm} className={styles.saveButton}>
                                {intl.formatMessage({id:'event.content.Save'})}
                            </Button> 
                        </div>
                    </Col>  
            </Col>
        </Row>                    
        )
    }
}

export default connect(({ form, loading }) => ({
    //submitting: loading.effects['form/submitStepForm'],
    //data: form.step,
  }))(injectIntl(Step3));