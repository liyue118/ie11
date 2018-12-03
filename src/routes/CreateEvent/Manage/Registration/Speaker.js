import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Tooltip, Menu, Dropdown, Form,Spin  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@Form.create()
class ParSpeaker extends Component {    
        constructor(props){
          super(props);
          this.state={
              isChecked:false,
              M1Disable:false,
              isChoose:false,
              SpeakerId:'',
              spinning:false,
          }
      }
      componentDidMount(){
        const  {dispatch,eventId} = this.props;
        this.setState({ spinning: true })
        dispatch({
            type:'eventManage/EventSpeakerList',
            payload:{EventId:eventId},
            callback:data=>{
              this.setState({spinning:false})
            }
        })

      }   
      
      MemberListChange=(value)=>{
            console.log(`Selected: ${value}`);
      }
      handleButtonClick=(key,value)=>{
        const {dispatch,eventId}=this.props
         if(key == "SpeakerId"){
            this.setState({SpeakerId:value})
         }else{
           const keys=key.key;
            if(keys=="checkIn"){
              dispatch({
                type:'eventManage/EventSpeakerChecked',
                payload:{EventId:eventId,SpeakerId:this.state.SpeakerId},
                callback:(data)=>{
                  if(data.ReturnCode===1001){
                    this.setState({ spinning: true })
                    dispatch({
                      type:'eventManage/EventSpeakerList',
                      payload:{EventId:eventId},
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
      render() {
          const {intl,EventSpeakerList}=this.props;
          const { spinning} = this.state;
          const menu = (
            <Menu onClick={this.handleButtonClick} >
              {/* <Menu.Item key='Checktheregistration'>
               {/* {intl.formatMessage({id:'event.table.manage'})} 
               {intl.formatMessage({id:'event.manage.Checktheregistration'})}
              </Menu.Item> */}
             
              <Menu.Item key='checkIn'>
                 {intl.formatMessage({id:'event.manage.checkIn'})}
              </Menu.Item>
            </Menu>
          );
        const menu2 = ( //已签到时加载
            <Menu onClick={this.handleButtonClick} >
              {/* <Menu.Item key='Checktheregistration'>
               {/* {intl.formatMessage({id:'event.table.manage'})} 
               {intl.formatMessage({id:'event.manage.Checktheregistration'})}
              </Menu.Item> */}
             
              {/* <Menu.Item key='checkIn'>
                 {intl.formatMessage({id:'event.manage.checkIn'})}
              </Menu.Item> */}
            </Menu>
          );
          
          const columns = [{
              title: intl.formatMessage({id:'event.manage.FirstName'}),
              dataIndex: 'FirstName',
              key: 'Fname',
            },{
            title: intl.formatMessage({id:'event.manage.LastName'}),
            dataIndex: 'LastName',
            key: 'Lname',
          },{
            title: intl.formatMessage({id:'event.manage.Company'}),
            dataIndex: 'CompanyName',
            key: 'company',
          },{
            title: intl.formatMessage({id:'event.manage.SignInState'}),
            dataIndex: 'CheckStatus',
            key: 'SignInState',
            render:(text,record)=>(
                <span style={record.CheckStatus=="已签到"?{color:"#60b8e8"}:{}}>{record.CheckStatus}</span>
            )
          },{
            title:intl.formatMessage({id:'event.manage.RegistrationDate'}),
            dataIndex: 'CreateDate',
            key: 'date',
          },{
            title:intl.formatMessage({id:'event.manage.Actions'}),
            dataIndex: 'action',
            render: (text, record) => (
               <div>
                <Dropdown overlay={record.CheckStatus === '已签到' ? menu2:menu} placement="bottomLeft"  trigger={['click']}  onClick={this.handleButtonClick.bind(this,"SpeakerId",text)}>
                 <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
                </Dropdown>
               </div>
            ),
          }];
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              selectedRowKeys>0?this.setState({isChoose:true}):this.setState({isChoose:false});
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
          return ( 
            <div>
              <Spin spinning={spinning}>
                <Table dataSource={EventSpeakerList} columns={columns} style={{marginTop:10}}  onSelect={this.handleButtonClick} />
              </Spin>
            </div>
           )
      }
}
export default connect(({eventManage = {}, loading }) => ({
  EventSpeakerList:eventManage.EventSpeakerListDate
}))(injectIntl(ParSpeaker));