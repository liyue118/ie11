import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Tooltip, Menu, Dropdown, Form  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../../utils/utils';
import styles from './index.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@Form.create()
class ParSponsor extends Component {    
        constructor(props){
          super(props);
          this.state={
              isChecked:false,
              M1Disable:false,
              isChoose:false
          }
      }
      componentDidMount(){
        const  {dispatch,eventId} = this.props;
        dispatch({
            type:'eventManage/EventSponsorList',
            payload:{'EventId':eventId}
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
          MemberListChange=(value)=>{
            console.log(`Selected: ${value}`);
          }

      render() {
          const {intl,EventSponsorList,teamMember,eventType}=this.props;
          const { getFieldDecorator } = this.props.form;
          console.log(EventSponsorList)
          const menu = (
            <Menu >
              <Menu.Item key='Checktheregistration'>
               {/* {intl.formatMessage({id:'event.table.manage'})} */}
               {intl.formatMessage({id:'event.manage.Checktheregistration'})}
              </Menu.Item>
             
              <Menu.Item key='CancelTheTicket'>
                 {/* {intl.formatMessage({id:'event.table.delete'})} */}
                 {intl.formatMessage({id:'event.manage.checkIn'})}
              </Menu.Item>
            </Menu>
          );
          const columns = [{
            title: intl.formatMessage({id:'event.manage.Name'}),
            dataIndex: 'ClientName',
            key: 'Name',
          },{
            title: intl.formatMessage({id:'event.manage.Industry'}),
            dataIndex: 'IndustryName',
            key: 'Industry',
          },{
            title: intl.formatMessage({id:'event.manage.Telephone'}),
            dataIndex: 'PhoneNumber',
            key: 'telephone',
          },{
            title: intl.formatMessage({id:'event.manage.EMail'}),
            dataIndex: 'EmailAddress',
            key: 'EMail',
          }
          // ,{
          //   title:intl.formatMessage({id:'event.manage.Actions'}),
          //   dataIndex: 'action',
          //   render: (text, record) => (
          //      <div>
          //        <Button className={styles.DactionContent}><Icon type="eye" /></Button>
          //      </div>
          //   ), }
          ];
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
              <Table dataSource={EventSponsorList} columns={columns} style={{marginTop:10}} />
            </div>
           )
      }
}
export default connect(({eventManage = {}, loading }) => ({
  EventSponsorList:eventManage.EventSponsorList
}))(injectIntl(ParSponsor));