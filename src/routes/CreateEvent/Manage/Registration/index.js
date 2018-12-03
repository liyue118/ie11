import React, { Component } from 'react';
import { message,Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Tooltip, Menu, Dropdown, Form,Spin} from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../../utils/utils';
import RegInformation from './Information';
import Attendee from './Attendee';
import ParSpeaker from './Speaker';
import ParSponsor from './Sponsor';
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
@Form.create()
class Registration extends Component {    
     constructor(props){
          super(props);
          this.state={
              isChecked:false,
              search:getPageQuery(props.location.search),
              eventid:getPageQuery(props.location.search).id,
              eventStatus:getPageQuery(props.location.search).eventstatus,
              M1Disable:false,
              isChoose:false,
              AttendeeStatus:"1003001", 
              NewAttendeeData:[],
              isShowInformation:getPageQuery(props.location.search).RegId!=null,
              selectedRowKeys:[],
              spinning:false,
              AttendeeRef:false,
              isFull:false

          }
      }
      componentDidMount(){
        const  {dispatch } = this.props;
        this.setState({spinning:true})
        dispatch({
          type:'eventManage/EventAttendeeListByStatus',
          payload:{'EventId':this.state.eventid,
                  Status:this.state.AttendeeStatus},
          callback:data=>{
            this.setState({spinning:false})
          }
        }) 
        
        dispatch({
            type:'eventManage/AllTeamMember',
            // payload:{'EventId':this.state.eventid}
        })
        dispatch({
          type:'eventManage/EventTeamMember',
          payload:{'EventId':this.state.eventid}
        })
      }
      componentWillReceiveProps(props){
        const {dispatch}=props;
        if((getPageQuery(props.location.search).RegId!=null)!=this.state.isShowInformation){
          // linkSearch=(!linkSearch);
          this.setState({
            isShowInformation:(getPageQuery(props.location.search).RegId!=null)
          })
        }
        dispatch({
          type:'eventManage/RegistraionIsFull',
          payload:{'EventId':this.state.eventid},
          callback:data=>{
            this.setState({isFull:data.IsFull})
          }
        })
      }   
      showModal = () => {
            this.setState({
              M1Disable: true,
            });
      }
        
      handleOk = (e) => {
            console.log(e);
            this.setState({
              M1Disable: false,
            });
      }
        
      handleCancel = (e) => {
            console.log(e);
            this.setState({
              M1Disable: false,
            });
      }
          
      MemberonDeselect=(value)=>{
            const  {dispatch } = this.props;
            const values={
              EventId:this.state.eventid,
              AdminId:value
            }
            
            dispatch({
              type:'eventManage/EventTeamMemberDelete',
              payload:values,
              callback:(data)=>{
                console.log(data);
              }
            })
      }

      MemberListChange=(value)=>{
            const  {dispatch } = this.props;
            const values={
              EventId:this.state.eventid,
              AdminId:value
            }
            dispatch({
              type:'eventManage/EventTeamMemberAddition',
              payload:values,
              callback:(data)=>{
                console.log(data);
              }
            })
      }
      parChange=(value)=>{
            const  {dispatch } = this.props;
            this.setState({AttendeeStatus:value});
            this.setState({spinning:true})
            dispatch({
              type:'eventManage/EventAttendeeListByStatus',
              payload:{'EventId':this.state.eventid,
                      Status:value},
              callback:e=>{
                this.setState({spinning:false})
              }
            }) 
      }
          
      MenuClick=(key)=>{
            const {location,dispatch}=this.props;
            const { NewAttendeeData, eventid, AttendeeStatus} =this.state;
            key=key.key!=undefined?key.key:key;
            if(key=='CheckTheReg'){
              window.open("/#/createEvent/manage/registration"+location.search+"&RegId="+this.state.NewAttendeeData.Id)
            }
            if(key=="recovery"){
              this.setState({spinning:true});
              dispatch({
                type:'eventManage/EventAttendeeStatusUpdate',
                payload:{
                        'EventId':eventid,
                        Status:'1003001',
                        AttendeeId:NewAttendeeData.AttendeeId,
                        Id:NewAttendeeData.Id,
                      },
                callback:(data)=>{
                    if(data.ReturnCode=="1001"){
                      // message.success(this.props.intl.formatMessage({id:'event.messge.approveSuccessfully'}));
                      dispatch({
                        type:'eventManage/EventAttendeeListByStatus',
                        payload:{'EventId':eventid,
                                Status:AttendeeStatus},
                        callback:data=>{
                            this.setState({spinning:false})
                        }
                      }) 
                    }
                }
              }) 
            }
            if(key=="approved"){
              if(!this.state.isFull){
                this.setState({spinning:true})
                dispatch({
                  type:'eventManage/EventAttendeeStatusUpdate',
                  payload:{
                          'EventId':eventid,
                          Status:'1003002',
                          AttendeeId:NewAttendeeData.AttendeeId,
                          Id:NewAttendeeData.Id,
                        },
                  callback:(data)=>{
                      if(data.ReturnCode=="1001"){
                        message.success(this.props.intl.formatMessage({id:'event.messge.approveSuccessfully'}));
                        dispatch({
                          type:'eventManage/EventAttendeeListByStatus',
                          payload:{'EventId':eventid,
                                  Status:AttendeeStatus},
                          callback:data=>{
                              this.setState({spinning:false})
                          }
                        }) 
                      }
                  }
                }) 
              }else{
                message.success('参与者人数已满')
              }
            }else if(key=="Refused"){
              this.setState({spinning:true})
              dispatch({
                type:'eventManage/EventAttendeeStatusUpdate',
                payload:{
                        'EventId':eventid,
                        Status:'1003005',
                        AttendeeId: NewAttendeeData.AttendeeId,
                        Id:NewAttendeeData.Id
                      },
                callback:(data)=>{
                    if(data.ReturnCode=="1001"){
                      message.success(this.props.intl.formatMessage({id:'event.message.RefusedSuccess'}));
                      dispatch({
                        type:'eventManage/EventAttendeeListByStatus',
                        payload:{'EventId':eventid,
                                Status:AttendeeStatus},
                        callback:e=>{
                                    this.setState({spinning:false})
                                }
                        
                      }) 
                    }
                }
              }) 
            } else if (key =="delete"){
              let _self=this;
              confirm({
                title: this.props.intl.formatMessage({id:'event.message.deleteSure'}),
                content: '',
                okText: this.props.intl.formatMessage({id:'event.Confirm'}),
                okType: 'danger',
                cancelText: this.props.intl.formatMessage({id:'event.Cancel'}),
                onOk() {
                  _self.setState({spinning:true})
                  dispatch({
                    type: 'eventManage/EventAttendeeDelete',
                    payload:{
                      Id: NewAttendeeData.Id
                    },
                    callback:(data)=>{
                      message.success(_self.props.intl.formatMessage({id:'event.message.delete'}));
                      dispatch({
                        type: 'eventManage/EventAttendeeListByStatus',
                        payload: {
                          'EventId':eventid,
                          Status: AttendeeStatus
                        },
                        callback:event=>{
                          _self.setState({spinning:false})
                        }
                      }) 
                    }
                  })
                },
                onCancel() {},
              });
            }else if(key=="BatchApproved" ||  key=='BatchRefused' || key=='Batchrecovery'){
              let status=(key=='BatchApproved')?'1003002':(key=='BatchRefused')?'1003005':'1003001';
              if(key==1003002 && this.state.isFull){
                message.success("参与者人数已满")
              }else{
                this.setState({spinning:true})
                dispatch({
                  type:'eventManage/EventAttendeeStatusBatchUpdate',
                  payload:{
                          'EventId':eventid,
                          Status:status,
                          EventAttendees:this.state.selectedRowKeys,
                        },
                  callback:(data)=>{
                      if(data.ReturnCode=="1001"){
                        if(status=="1003002"){
                          message.success(this.props.intl.formatMessage({id:'event.messge.approveSuccessfully'}));
                        }else if(status=='1003005'){
                          message.success(this.props.intl.formatMessage({id:'event.message.RefusedSuccess'}));
                        }else{
                          message.success(this.props.intl.formatMessage({id:'event.message.RecoverySuccess'}));
                        }
                        dispatch({
                          type:'eventManage/EventAttendeeListByStatus',
                          payload:{'EventId':eventid,
                                  Status:AttendeeStatus},
                          callback:data=>{
                                  this.setState({spinning:false})
                                  }
                        }) 
                      }
                  }
                }) 
              }
            }
      }
     
      setAttendeeData=(value)=>{
            this.setState({
              NewAttendeeData:value
            })
      }
      onAttendeeRef=(ref)=>{
        this.Attendee = ref;
        this.Attendee.onRefresh();
        this.setState({AttendeeRef:true})
      }
      tabclick=(value,ref)=>{
        const  {dispatch } = this.props;
        if(value==1){
          this.setState({spinning:true})
          dispatch({
            type:'eventManage/EventAttendeeListByStatus',
            payload:{'EventId':this.state.eventid,
                    Status:'1003001'},
            callback:data=>{
              this.setState({spinning:false})
            }
          }) 
        }else if(value==2){
          if(this.state.AttendeeRef){
            this.Attendee.onRefresh();
          }
        }
      }
      render() {
          const {intl,AttendeeListByStatus,AllTeamMemberList,EventTeamMemberList}=this.props;
          const { getFieldDecorator } = this.props.form;
          const {spinning}=this.state;
          const teamMemberList=AllTeamMemberList!=undefined?AllTeamMemberList.map(province => (province.DisplayName!=null)?<Option key={`${province.Id}`} value={province.Id}>{province.FirstName}{province.LastName}</Option>:''):'';
          const menu = (
            this.state.AttendeeStatus=="1003005"?
            <Menu onClick={this.MenuClick} >
              <Menu.Item key='CheckTheReg'>
               {intl.formatMessage({id:'event.manage.CheckTheReg'})}
              </Menu.Item>
              <Menu.Item key='recovery'>
                {intl.formatMessage({id:'event.manage.recovery'})}
              </Menu.Item>
            </Menu>
            :
            <Menu onClick={this.MenuClick} >
              <Menu.Item key='CheckTheReg'>
               {intl.formatMessage({id:'event.manage.CheckTheReg'})}
              </Menu.Item>
              <Menu.Item key='approved'>
                {intl.formatMessage({id:'event.manage.approved'})}
              </Menu.Item>
              <Menu.Item key='Refused'>
                 {intl.formatMessage({id:'event.manage.Refused'})}
              </Menu.Item>
              <Menu.Item key='delete'>
                 {intl.formatMessage({id:'event.manage.Delete'})}
              </Menu.Item>
            </Menu>
          );
        
          const BatchMenu=(
            <Menu>
                {/* <Menu.Item key="BatchApproved">{intl.formatMessage({id:'event.manage.BatchApproved'})}</Menu.Item> */}
                <Menu.Item key="BatchRefused">{intl.formatMessage({id:'event.manage.BatchRefused'})}</Menu.Item>
            </Menu>
          )
          
          const columns = [{
            title: intl.formatMessage({id:'event.manage.FirstName'}),
            dataIndex: 'FirstName',
            key: 'Fname',
          },{
            title: intl.formatMessage({id:'event.manage.LastName'}),
            dataIndex: 'LastName',
            key: 'Lname',
          },{
            title: intl.formatMessage({id:'event.manage.EMail'}),
            dataIndex: 'EmailAddress',
            key: 'email',
          },{
            title: intl.formatMessage({id:'event.manage.Company'}),
            dataIndex: 'CompanyName',
            key: 'company',
          },{
            title:intl.formatMessage({id:'event.manage.Position'}),
            dataIndex: 'JobTitle',
            key: 'position',
          },{
            title:intl.formatMessage({id:'event.manage.RegistrationDate'}),
            dataIndex: 'RegisterDate',
            key: 'date',
          },{
            title: intl.formatMessage({id:'event.manage.TicketType'}),
            dataIndex: 'TicketType',
            key: 'ticket',
          },{
            title: intl.formatMessage({id:'event.manage.discount'}),
            dataIndex: 'DiscountName',
            key: 'discount',
          },{
            title: intl.formatMessage({id:'event.manage.PaymentInstrument'}),
            dataIndex: 'PaymentType',
            key: 'pay',
          },{
            title:intl.formatMessage({id:'event.manage.Actions'}),
            dataIndex: 'action',
            render: (text, record) => (
               <div>
                <Dropdown overlay={menu} placement="bottomLeft"  trigger={['click']} onClick={this.setAttendeeData.bind(this,text)}>
                 <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
              </Dropdown>
               </div>
            ),
          }];
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRowKeys);
              this.setState({selectedRowKeys:selectedRowKeys})
              selectedRowKeys.length>0?this.setState({isChoose:true}):this.setState({isChoose:false});
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
          return ( 
             <Row className={styles.main}>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                      {intl.formatMessage({id:'event.menu.Registration List'})}
                    </div>
               </div>
              {this.state.isShowInformation?
                <RegInformation eventid={this.state.eventid} search={this.state.search}/>  
                :
                  <div className={styles.content}>
                    <div className={styles.memberList}>
                        <FormItem label={intl.formatMessage({id:'event.manage.ActivityOrganizer'})} className={styles.fromItem} style={{border:'none'}}> 
                            {getFieldDecorator('contact', {
                                              // rules: [{ required: true, message: 'Please input event title！' }],
                                      initialValue:EventTeamMemberList
                                  })(  
                            <Select
                            mode="multiple"
                            style={{ width: '100%',borderRadius: 5,border:'1px solid rgba(0,0,0,0.2)'}}
                            onSelect={this.MemberListChange}
                            onDeselect={this.MemberonDeselect}
                          >
                            {teamMemberList}
                      </Select>
                                  )}
                          </FormItem>
                  </div>
                  <Row gutter={24}>
                    <Tabs defaultActiveKey="1" onTabClick={this.tabclick}>
                      <TabPane tab={intl.formatMessage({id:'event.manage.Pending'})} key="1">
                      <Select defaultValue="1003001" style={{ width: 120,marginLeft:10,marginRight:10 }} onChange={this.parChange}>
                        <Option value="1003001">{intl.formatMessage({id:'event.manage.Pending'})}</Option>
                        <Option value="1003005">{intl.formatMessage({id:'event.manage.passed'})}</Option>
                      </Select>
                      {this.state.isChoose?(
                       <span>
                         {this.state.AttendeeStatus=='1003001'?(
                           <span>
                           <Button type="primary" onClick={this.MenuClick.bind(this,"BatchApproved")}>{intl.formatMessage({id:'event.manage.BatchApproved'})}</Button>
                           <Button type="primary" onClick={this.MenuClick.bind(this,"BatchRefused")} style={{marginLeft:5}}>{intl.formatMessage({id:'event.manage.BatchRefused'})}</Button>
                           </span>
                         ):(
                          <Button type="primary" onClick={this.MenuClick.bind(this,"Batchrecovery")} style={{marginLeft:5}}>{intl.formatMessage({id:'event.manage.Batchrecovery'})}</Button>
                         )
                         }
                       </span>
                      )
                      :null}
                      <Spin spinning={spinning}>
                        <Table rowSelection={rowSelection} dataSource={AttendeeListByStatus} columns={columns} style={{marginTop:10}} />
                      </Spin>
                      </TabPane>
                      <TabPane tab={intl.formatMessage({id:'event.manage.Attendee'})} key="2">
                          <Attendee eventId={this.state.eventid} eventStatus={this.state.eventStatus} onRef={this.onAttendeeRef} isFull={this.state.isFull}/>
                      </TabPane>
                      <TabPane tab={intl.formatMessage({id:'event.manage.Speaker'})} key="3">
                          <ParSpeaker eventId={this.state.eventid}/>
                      </TabPane>
                      <TabPane tab={intl.formatMessage({id:'event.manage.Sponsor'})} key="4">
                          <ParSponsor eventId={this.state.eventid}/>
                      </TabPane>
                    </Tabs>
                 </Row>
              </div>
            }
             </Row>
           )
      }
}
export default connect(({eventManage = {}, loading }) => ({
  AllTeamMemberList:eventManage.AllTeamMember,
  EventTeamMemberList:eventManage.EventTeamMember,
  AttendeeListByStatus:eventManage.AttendeeListByStatus
}))(injectIntl(Registration));