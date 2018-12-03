import React, { Component,Fragment } from 'react';
import { Route, Redirect, routerRedux } from 'dva/router';
import { Link } from 'dva/router';
import { stringify } from 'qs';
import { Row, Col, Icon, Steps, Menu, Dropdown, Input, Table ,Button, Select } from 'antd';
import { connect } from 'dva';  
import {injectIntl,formatMessage} from 'react-intl';
import styles from '../Event/Draft/style.less';

class Current extends Component {
    constructor(){
        super();
        this.state={
            selectedRowKeys: [], 
            dataList:[],
            pageSize: 15,
            page: {
              ItemsPerPage: 15,
              Page: 1,
              TotalPages: 1,
              TotalRecords: 0,
            }            
        }
    }
    componentDidMount(){
      this.EventListByStatus()
    }

    EventListByStatus() {
      const {dispatch}=this.props;
      dispatch({
        type: 'event/Efeventlist',
        payload: {
          'Filter': '1009003',
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false
        },
        callback: (data, page) => {
          this.setState({ dataList: data, page: page })
        }
      })
    }

    handleButtonClick(value){
      this.setState({
        id:value
      })
    }

    handleMenuClick = (key,data) => {
      key= (key=='manage') ? 'manage' : key.key;
      if(key =='manage'){
        this.props.dispatch(routerRedux.push({
          pathname: '/createEvent/manage/registration',
          search:stringify({
            id: data,
            eventstatus:'1009003'
          })})
        );
      }
      if(key =='preview'){
        window.open('/#/userInterface/eventDetails?id='+this.state.id)
      }
    }

    render(){
        const {eventlistDate,intl}=this.props;
        const {dataList,page,pageSize}=this.state;
        const menu = (
          <Menu onClick={this.handleMenuClick}>
            <Menu.Item key='preview'>
             {intl.formatMessage({id:'event.table.preview'})}
            </Menu.Item>
            {/* <Menu.Item key='Duplicate'>
              {intl.formatMessage({id:'event.table.duplicate'})}
            </Menu.Item> */}
          </Menu>
        );
      const columns = [{
          title: intl.formatMessage({id:'event.table.eventId'}),
          dataIndex: 'number',
          // render:title => console.log(title),
          // render: title => `${name.first} ${name.last}`,
          // sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: intl.formatMessage({id:'event.table.eventTitle'}),
          dataIndex: 'title',
          render: (text, record) => (
            <a href={'/#/createEvent/setUp/general?id='+text.id+'&eventstatus=1009003'}>{text.title}</a>
          )
          // render:title => console.log(title),
          // render: title => `${name.first} ${name.last}`,
          // sorter: (a, b) => a.name.length - b.name.length,
        }, 
        {
          title:  intl.formatMessage({id:'event.table.location'}),
          dataIndex: 'location',
          // sorter: (a, b) => a.industry.length - b.industry.length,
        }, 
        {
          title:  intl.formatMessage({id:'event.table.startDate'}),
          dataIndex: 'start',
          // sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title:  intl.formatMessage({id:'event.table.attendance'}),
          dataIndex: 'attendance',
          // sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title:intl.formatMessage({id:'event.table.action'}),
          dataIndex: 'action',
          render: (text, record) => (
             <div>
              <Button className={styles.EditB} onClick={this.handleMenuClick.bind(this,'manage',text)} >
                <Icon type="form" theme="outlined"/>
              </Button> 
              <Dropdown overlay={menu} placement="bottomLeft" onClick={this.handleButtonClick.bind(this,text)} trigger={['click']}>
                <Button className={styles.DactionContent} style={{color:'#00a1de',marginLeft:10}} >
                  <Icon type="ellipsis" style={{fontSize:'18px',fontWeight:"bold"}}/>
                </Button>
              </Dropdown>
             </div>
          ),
        }];
        return(
            <div className={styles.main}>
               <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Event/Current
                    </div>
               </div>
                <Row gutter={24} style={{padding:"24px 24px 0"}}>
                    <Col span={24} style={{textAlign:'left'}}>
                        <Link to="/event/create" className={styles.logo} key="logo">
                            <Button type="primary" icon="plus" style={{marginLeft:10}}>{intl.formatMessage({id:'event.createEvent'})}</Button>
                        </Link>
                        <Button type="primary" icon="download" onClick={this.showModal} style={{marginLeft:10}}></Button>
                    </Col>
                    <Col span={24}>
                         <Table  columns={columns} dataSource={dataList} style={{marginTop:10}} 
                            pagination={{
                              onShowSizeChange: (current, pageSize) => {
                                const { dispatch } = this.props;
                                dispatch({
                                  type: "event/changePageSize",
                                  payload: pageSize,
                                  callback: data => {
                                    this.setState({
                                      pageSize: data
                                    })
                                  }
                                })
                              },
                              onChange: (pageNumber) => {
                                const { dispatch } = this.props;
                                const { pageSize } = this.state
                                dispatch({
                                  type: 'event/Efeventlist',
                                  payload: {
                                    'Filter': '1009003',
                                    'QueryClause': null,
                                    'OrderBy': '',
                                    'Page': pageNumber,
                                    'ItemsPerPage': pageSize,
                                    'IsExport': false
                                  },
                                  callback: (data, page) => {
                                    this.setState({ dataList: data, page: page })
                                  }
                                })
                              },
                              //showSizeChanger: true,
                              pageSize: pageSize,
                              total: page.TotalRecords,
                            }}
                         />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(({event = {}, loading }) => ({
  // eventlistDate:event.eventlistDate
}))(injectIntl(Current)); 