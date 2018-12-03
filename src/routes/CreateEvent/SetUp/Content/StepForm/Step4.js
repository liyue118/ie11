import React, { Component } from 'react';
import { Row,Col,Form, Input,Button,Card,Alert,Modal,TimePicker,Select, Icon, List,Badge,Cascader ,Upload } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Map,Marker  } from 'react-amap';
import PoiPicker from '../../../../../components/PoiPicker';
import {getPageQuery} from '../../../../../utils/utils';
import { formatMessage,injectIntl } from 'react-intl';
import styles from './style.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;
@connect(({ eventVenueManuallyAddition, loading }) => ({
    eventVenueManuallyAddition,
    submitting: loading.effects['eventVenueManuallyAddition/getEventVenueManuallyAddition'],
  })) 
@connect(({ eventVenueList, loading }) => ({
    eventVenueList,
    submitting: loading.effects['eventVenueList/getEventVenueList'],
  }))
  @connect(({ venueAllList, loading }) => ({
    venueAllList,
    submitting: loading.effects['venueAllList/getVenueAllList'],
  }))
  @connect(({ eventVenueAddition, loading }) => ({
    eventVenueAddition,
    submitting: loading.effects['eventVenueAddition/getEventVenueAddition'],
  }))
  @connect(({ eventVenueEdit, loading }) => ({
    eventVenueEdit,
    submitting: loading.effects['eventVenueEdit/getEventVenueEdit'],
  }))
  @connect(({ eventVenueReset, loading }) => ({
    eventVenueReset,
    submitting: loading.effects['eventVenueReset/getEventVenueReset'],
  }))
@Form.create()
class Step4 extends Component{
    constructor() {
        super();
        //this.mapCenter = { longitude: 120, latitude: 30.5 };
        this.chooseVenne = this.chooseVenne.bind(this);
        const selectVenue = [];
      }
    state = {
        data: [],
        value: undefined,
        venueType:'',
        visible: false,
        hideNewModal:false,
        loading: false,
        addVenue:false,
        eventId:getPageQuery(location.search).id,
        EventVenueId:''
      }
      componentDidMount(){
          this.getvenueList();
          this.venueAllList();
      }
      changeForm=(value)=>{
          console.log(value);
          if(value.source == 'search'){
            //console.log('search')
            this.props.form.setFieldsValue({
                EventId:this.state.eventId,
                Name:value.item.name,
                Address:value.item.pname+value.item.cityname+value.item.adname+value.item.address,
                Longitude:value.item.location.lng+"",
                Latitude:value.item.location.lat+"",
                City:'',
                Province:'',
                Region:'',
            })
          }
          if(value.source == 'suggest'){
              //console.log('suggest')
              this.props.form.setFieldsValue({
                EventId:this.state.eventId,
                Name:value.item.name,
                City:'',
                Province:'',
                Region:'',
                Address:value.item.district+value.item.address,
                Longitude:value.item.location.lng+"",
                Latitude:value.item.location.lat+"",
            })
          }
      }
    chooseVenne =(Id)=>{
        this.props.dispatch({
            type: 'eventVenueAddition/getEventVenueAddition',
            payload:{
                EventId:getPageQuery(location.search).id,
                VenueId:Id
            }
          })
          .then(()=>{
            this.getvenueList();
            this.venueAllList();
        });
    }
    editVenne =(Id)=>{
        this.setState({
            venueType:'edit',
            addVenue:true,
            EventVenueId:Id
        })
        console.log(Id);
        this.props.dispatch({
            type: 'eventVenueList/getEventVenueList',
            payload:{
                "EventId":getPageQuery(location.search).id
            }
          })
        .then(()=>{
            this.props.form.setFieldsValue({
                EventId:this.state.eventId,
                EventVenueId:this.selectVenue.Id,
                Name:this.selectVenue.Name,
                Address:this.selectVenue.Address,
                OtherDetails:this.selectVenue.OtherDetails,
                Longitude:this.selectVenue.Longitude+"",
                Latitude:this.selectVenue.Latitude+"",
                City:this.selectVenue.City,
                Province:this.selectVenue.Province,
                Region:this.selectVenue.Region,
            })
        })
    }
    changeAddVenue= ()=>{
        this.setState({
            venueType:'add',
            addVenue:true
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.EventVenueId == ''){
            console.log(this.state.EventVenueId);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  this.setState({
                      addVenue: false,
                  });
                  this.props.dispatch({
                      type: 'eventVenueManuallyAddition/getEventVenueManuallyAddition',
                      payload:values
                  })
                  .then(()=>{
                      this.getvenueList();
                      this.venueAllList();
                  });
                }
              });
        }
        else{
            console.log(this.state.EventVenueId);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  console.log('Editevalues of form: ', values);
                  this.setState({
                      addVenue: false,
                  });
                  this.props.dispatch({
                      type: 'eventVenueEdit/getEventVenueEdit',
                      payload:values
                  })
                  .then(()=>{
                      this.getvenueList();
                      this.venueAllList();
                  })
                  .then(()=>{
                    this.setState({
                        EventVenueId:''
                    })
                  })
                }
              });
            
        }
        
      }
      getvenueList(){
          this.props.dispatch({
            type: 'eventVenueList/getEventVenueList',
            payload:{
                "EventId":getPageQuery(location.search).id
            }
          })
      }
      venueAllList(){
        this.props.dispatch({
            type: 'venueAllList/getVenueAllList',
            payload:{
                OrderBy:"Usage"
            }
          })
      }
    venueCancel=()=>{
        this.setState({
            addVenue:false
        })
        this.props.dispatch({
            type: 'eventVenueReset/getEventVenueReset',
            payload:{
                "EventId":getPageQuery(location.search).id
            }
        })
        .then(()=>{
            this.getvenueList();
            this.venueAllList();
        })
        .then(()=>{
            this.setState({
                EventVenueId:''
            })
        })
    }
    Cancel =()=>{
        this.setState({ addVenue: false });
    }
    cascOnChange(value) {
        console.log(value);
    }
      
      componentDidUpdate(){
        //this._renderLayer();  
      }
      normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }
    render(){
        const { form,location } = this.props;
        const {intl}=this.props;
        const {eventVenueList:{eventVenueList},venueAllList:{venueAllList},eventVenueReset:{eventVenueReset}}= this.props;
        if(typeof(eventVenueList) === 'undefined'|| eventVenueList == null){}else{
            this.selectVenue = eventVenueList;
        }
        if(typeof(venueAllList) === 'undefined' || venueAllList.length<1 || venueAllList == null){}else{
        }
        if(typeof(eventVenueReset) === 'undefined' || eventVenueReset.length<1 || eventVenueReset == null){}else{
            
        }
        const { getFieldDecorator} = form;
        const onValidateForm = () => {
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/createEvent/setUp/content/step-form/agenda',
                    search:location.search
                }) 
            );
        };
        const formItemLayout = {
        labelCol: {
            xs: { span: 0 },
            sm: { span: 0 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
        };
        return(
            <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Card style={{border:0}}>
                    
                        {typeof(eventVenueList)==String || typeof(eventVenueList)==undefined?(
                            ''
                        ):(
                            <div>
                            <Button type="primary" icon="plus-circle" onClick={this.changeAddVenue}>{intl.formatMessage({id:'event.content.Add a venue manually'})}</Button>
                            {/* <Button type="primary" style={{marginLeft:8}}><Icon type="sort-ascending" theme="outlined" /></Button>
                            <Button type="primary" style={{marginLeft:2}}><Icon type="ordered-list" theme="outlined" /></Button> */}
                            </div>  
                        )}
                        
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <h4 style={{margin:'12px 0'}}>{intl.formatMessage({id:'event.content.Used/Saved venues'})}</h4>
                            {typeof(eventVenueList)==String||typeof(eventVenueList)=='undefined'?(''):(
                                <div>
                                {eventVenueList == null?(
                                <div>
                                {venueAllList.map(item => (
                                <Col xl={8} lg={8} md={8} sm={12} xs={12}>
                                <Card
                                hoverable
                                className="mapCard"
                                cover={<div style={{ width: '100%', height: 220,padding:'24px 24px 0 24px'}}>
                                        <Map
                                            zoom={12}
                                            center={{longitude:parseFloat(item.Longitude),latitude:parseFloat(item.Latitude) }}
                                            useAMapUI={true}
                                        >
                                        <Marker position={{longitude:parseFloat(item.Longitude),latitude:parseFloat(item.Latitude) }}/>
                                        </Map>
                                        </div>
                                    }
                                actions={[<a onClick={()=>this.chooseVenne(item.Id)}>{intl.formatMessage({id:'event.content.Select this venue'})}</a>]}
                                >
                                <Meta
                                title={item.Name}
                                description={item.Address}
                                />
                                <Badge count={item.Rate} />
                                </Card>
                            </Col>
                            ))}
                            </div>
                            ):(
                                <Col xl={8} lg={8} md={8} sm={12} xs={12}>
                                <Card
                                hoverable
                                style={{background:'#60b8e8'}}
                                className="mapCard"
                                cover={<div style={{ width: '100%', height: 220,padding:'24px 24px 0 24px'}}>
                                            <Map
                                             zoom={12}
                                             center={{longitude:parseFloat(eventVenueList.Longitude),latitude:parseFloat(eventVenueList.Latitude)}}
                                             useAMapUI={true}
                                            >
                                            <Marker position={{longitude:parseFloat(eventVenueList.Longitude),latitude:parseFloat(eventVenueList.Latitude)}} />
                                            </Map>
                                        </div>
                                    }
                                actions={[<a onClick={()=>this.editVenne(eventVenueList.Id)}>{intl.formatMessage({id:'event.content.Edit venue'})}</a>]}
                                >
                                <Meta
                                className="mapcardMeta"
                                title={eventVenueList.Name}
                                description={eventVenueList.Address}
                             
                             />
                                </Card>
                            </Col>
                            )}
                                </div>
                            )}
                           
                        </Col>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div style={{position:'relative',height:'30px'}}>
                            <Button onClick={onValidateForm} className={styles.saveButton}>
                            {intl.formatMessage({id:'event.content.Save'})}
                            </Button> 
                        </div>
                    </Col>  
                    </Card>
                    <Modal
                    destroyOnClose
                    title={this.state.venueType=='add'?intl.formatMessage({id:'event.content.Add a venue manually'}):intl.formatMessage({id:'event.content.Edit venue'})}
                    visible={this.state.addVenue}
                    footer={[
                        <Button onClick={this.venueCancel}>{intl.formatMessage({id:'event.content.Reset'})}</Button>,
                        <Button onClick={this.Cancel}>{intl.formatMessage({id:'event.content.Cancel'})}</Button>,
                        <Button type="primary" onClick={this.handleSubmit}>{intl.formatMessage({id:'event.content.Save'})}</Button>
                    ]}
                    onCancel={this.Cancel}
                    width={900}
                    >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card style={{border:0}}>
                                <Form onSubmit={this.handleSubmit}
                                    style={{margin:'0 auto'}}
                                >
                                <Row span={24}>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                        >
                                            <div style={{ width: '100%', height: 265}}>
                                                <Map 
                                                zoom={6} 
                                                //center={[120, 30]} 
                                                useAMapUI
                                                >
                                                <PoiPicker
                                                changeForm={this.changeForm.bind(this)}
                                                />  
                                                </Map>
                                            </div>         
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{paddingLeft:12}}>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('EventId', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('EventVenueId', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('Name', {
                                                rules: [{
                                                //type: 'name', message: 'The input is not valid Venue Name!',
                                                }, {
                                                required: true, message: 'Please input your Venue Name!',
                                                }],
                                            })(
                                                <Input 
                                                id="pickerInput"
                                                placeholder={intl.formatMessage({id:'event.content.Venue name'})}/>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('Address', {
                                                rules: [{
                                                //type: 'detail', message: 'The input is not valid Venue Name!',
                                                }, {
                                                required: true, message: 'Please input your Address!',
                                                }],
                                            })(
                                                <Input placeholder={intl.formatMessage({id:'event.content.Address'})}/>
                                            )}      
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('OtherDetails', {
                                                rules: [{
                                                //type: 'attachment', message: 'The input is not valid detail!',
                                                }, {
                                                required: true, message: 'Please input your travel guidance!',
                                                }],
                                            })(
                                                <TextArea rows={8} 
                                                placeholder={intl.formatMessage({id:'event.content.Travel guidance'})}
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('Longitude', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('Latitude', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('Region', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('Province', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                        <FormItem
                                            style={{display:'none'}}
                                        >
                                        {getFieldDecorator('City', {

                                        })(
                                            <Input />
                                        )}
                                        </FormItem>
                                    </Col>
                                </Row> 
                                </Form>
                                </Card>
                            </Col>
                        </Row>
                    </Modal>
                </Col>   
            </Row>
        )
    }
}
export default connect(({ form, loading }) => ({
    //submitting: loading.effects['form/submitStepForm'],
    //data: form.step,
}))(injectIntl(Step4));