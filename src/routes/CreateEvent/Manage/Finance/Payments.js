import React, { Component } from 'react';
import { Row, Col ,Icon,Table, Select ,Button ,Input , Modal, Tabs ,Tooltip, Menu, Dropdown, Form  } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import {getPageQuery} from '../../../../utils/utils';
import styles from './payments.less'

const Search = Input.Search;
const { Option, OptGroup } = Select;
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@Form.create()
class Payments extends Component {    
        constructor(props){
          super(props);
          this.state={
              isChecked:false,
              eventid:getPageQuery(props.location.search).id,
              isChoose:false
          }
      }
      componentDidMount(){
        const  {dispatch,eventId} = this.props;
        dispatch({
            type:'eventManage/EventAllPaymentList',
            payload:{EventId:eventId}
        })

      }   
      render() {
          const {intl,generalInitDate,teamMember,eventType}=this.props;
          const { getFieldDecorator } = this.props.form;
         const menu = (
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key='manage'>
               {/* {intl.formatMessage({id:'event.table.manage'})} */}
               付款
              </Menu.Item>
              <Menu.Item key='Duplicate'>
                {/* {intl.formatMessage({id:'event.table.duplicate'})} */}
                编辑
              </Menu.Item>
              <Menu.Item key='delete'>
                 {/* {intl.formatMessage({id:'event.table.delete'})} */}
                 查看
              </Menu.Item>
              <Menu.Item key='delete'>
                 {/* {intl.formatMessage({id:'event.table.delete'})} */}
                 索要发票
              </Menu.Item>
              <Menu.Item key='delete'>
                 {/* {intl.formatMessage({id:'event.table.delete'})} */}
                 作废付款
              </Menu.Item>
            </Menu>
          );
          const dataSource = [
            {
              key: '1',
              payId:'23380',
              payDate:'2018-09-12',
              payments:'莎莎',
              payee:'丽丽',
              money:'200',
              state:'未支付',
              payMethod:'现场支付'
            }
          ];
          
          const columns = [{
            title: '付款ID',
            dataIndex: 'payId',
            key: 'payId',
          },{
            title: '付款日期',
            dataIndex: 'payDate',
            key: 'payDate',
          },{
            title: '付款方式',
            dataIndex: 'payMethod',
            key: 'payMethod',
          },{
            title: '付款人',
            dataIndex: 'payments',
            key: 'payments',
          },{
            title: '收款人',
            dataIndex: 'payee',
            key: 'payee',
          },{
            title: '金额',
            dataIndex: 'money',
            key: 'money',
          },{
            title: '付款状态',
            dataIndex: 'state',
            key: 'state',
            render: (text, record) => (
              <span style={{color:'red'}}>{text}</span>
            )
          },{
            title:intl.formatMessage({id:'event.table.action'}),
            dataIndex: 'action',
            render: (text, record) => (
               <div>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
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
             <Row className={styles.main}>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                      {intl.formatMessage({id:'event.menu.Paymetns'})}
                    </div>
               </div>
               <div className={styles.content}>
                  <div style={{paddingTop:10}}>
                        <Button type="primary" icon="download" style={{marginLeft:10}}></Button>  
                        <Select defaultValue="lucy" style={{ width: 120,marginRight:10,marginLeft:10}}>
                              <Option value="lucy">全部付款</Option>
                              <Option value="fsdf">已结算付款</Option>
                              <Option value="jack">无效付款</Option>
                        </Select>
                       {this.state.isChoose?
                       <span>
                          <Button type="primary" style={{marginRight:10}}>批量付款</Button>
                          <Button type="primary">批量索要发票</Button>
                       </span>
                       :null}
                    </div>
                    <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} style={{marginTop:10}} />   
               </div>
             </Row>
           )
      }
}
export default connect(({eventManage= {}, loading }) => ({
  AllPaymentList:eventManage.AllPaymentList
}))(injectIntl(Payments));